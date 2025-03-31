'use client';
import { useState } from 'react';
import Modal from './components/Modal';
import { useCategories } from './hooks/useCategories';
import { useTransactions } from './hooks/useTransactions';
import { useUserData } from './hooks/useUserData';
import * as S from './styles';
import { formatCurrency, formatDate } from './utils/formatters';

export default function Home() {
  const { data: userData } = useUserData();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    description: '',
    category: '',
    type: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: ''
  });
  const [transactionToEdit, setTransactionToEdit] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const {
    transactions,
    totalCount,
    totalPages,
    isLoading,
    isError,
    error,
    isDeleting,
    isUpdating,
    updateTransaction,
    deleteTransaction
  } = useTransactions(
    userData?.user?.id,
    currentPage,
    10, // items per page
    filters
  );


  const { categories } = useCategories(userData?.user?.id);

  // Calculate totals
  const totals = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'income') {
      acc.income += transaction.amount;
    } else {
      acc.expense += transaction.amount;
    }
    acc.balance = acc.income - acc.expense;
    return acc;
  }, { income: 0, expense: 0, balance: 0 });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log("🚀 ~ handleFilterChange ~ name:", name, value);

    setFilters(prev => {
      const updatedFilters = { ...prev, [name]: value };

      // If startDate is set and endDate is empty, set endDate to startDate
      if (name === "startDate" && !updatedFilters.endDate) {
        updatedFilters.endDate = value;
      }

      return updatedFilters;
    });

    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (transaction: any) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this transaction?');

    if (isConfirmed) {
      try {
        await deleteTransaction(id); // Call the delete function from the hook
        setIsModalOpen(false); // Close modal after successful deletion
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };


  const handleSave = async (updatedTransaction: any) => {
    try {
      await updateTransaction(updatedTransaction._id, updatedTransaction);
      setIsModalOpen(false); // Close the modal after successful save
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const resetFilters = () => {
    setFilters({
      description: '',
      category: '',
      type: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: ''
    });
    setCurrentPage(1); // Reset to first page when filters are reset
  };

  if (isLoading) return <S.LoadingIndicator>Loading...</S.LoadingIndicator>;
  if (isError) return <S.ErrorMessage>{error?.message}</S.ErrorMessage>;

  return (
    <S.PageContainer>
      <S.Title>Transactions</S.Title>

      {/* Summary Section */}
      <S.Section>
        <S.SummaryCard>
          <S.SummaryItem>
            <span>Income:</span>
            <S.AmountPositive>{formatCurrency(totals.income)}</S.AmountPositive>
          </S.SummaryItem>
          <S.SummaryItem>
            <span>Expense:</span>
            <S.AmountNegative>{formatCurrency(totals.expense)}</S.AmountNegative>
          </S.SummaryItem>
          <S.SummaryItem>
            <span>Balance:</span>
            <S.AmountBalance $positive={totals.balance >= 0}>
              {formatCurrency(totals.balance)}
            </S.AmountBalance>
          </S.SummaryItem>
          <S.SummaryItem>
            <span>Number of Transactions:</span>
            <span>{totalCount}</span>
          </S.SummaryItem>
        </S.SummaryCard>
      </S.Section>

      {/* Filters Section */}
      <S.Section>
        <S.FilterForm>
          <S.FilterGroup>
            <S.FilterInput
              type="text"
              name="description"
              placeholder="Description"
              value={filters.description}
              onChange={handleFilterChange}
            />
          </S.FilterGroup>

          <S.FilterGroup>
            <S.FilterSelect
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </S.FilterSelect>
          </S.FilterGroup>

          <S.FilterGroup>
            <S.FilterSelect
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </S.FilterSelect>
          </S.FilterGroup>

          <S.FilterGroup>
            <S.FilterInput
              type="number"
              name="minAmount"
              placeholder="Min Amount"
              value={filters.minAmount}
              onChange={handleFilterChange}
            />
            <S.FilterInput
              type="number"
              name="maxAmount"
              placeholder="Max Amount"
              value={filters.maxAmount}
              onChange={handleFilterChange}
            />
          </S.FilterGroup>

          <S.FilterGroup>
            <S.FilterInput
              type="date"
              name="startDate"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
            <S.FilterInput
              type="date"
              name="endDate"
              placeholder="End Date"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
            {/* Reset Filters Button */}
            <S.ResetButton onClick={resetFilters}>Reset Filters</S.ResetButton>
          </S.FilterGroup>


        </S.FilterForm>
      </S.Section>

      {/* Transactions Table */}
      <S.Section>
        <S.ResponsiveTable>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction._id}>
                <td>{formatDate(`${transaction.date}`)}</td>
                <td>{transaction.description}</td>
                <td>
                  {typeof transaction.category === 'object'
                    ? transaction.category.name
                    : 'Uncategorized'}
                </td>
                <td>
                  <S.TypeBadge $type={transaction.type}>
                    {transaction.type}
                  </S.TypeBadge>
                </td>
                <td>
                  <S.Amount $type={transaction.type}>
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </S.Amount>
                </td>
                <td>
                  <S.ActionButtons>
                    <S.EditButton
                      onClick={() => handleEdit(transaction)}
                      disabled={isUpdating}
                    >
                      Edit
                    </S.EditButton>
                    <S.DeleteButton
                      onClick={() => handleDelete(transaction._id)}
                      disabled={isDeleting}
                    >
                      Delete
                    </S.DeleteButton>
                  </S.ActionButtons>
                </td>
              </tr>
            ))}
          </tbody>
        </S.ResponsiveTable>

        {/* Pagination */}
        {totalPages > 1 && (
          <S.Pagination>
            <S.PaginationButton
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </S.PaginationButton>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <S.PaginationButton
                key={page}
                $active={page === currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </S.PaginationButton>
            ))}

            <S.PaginationButton
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </S.PaginationButton>
          </S.Pagination>
        )}
      </S.Section>

      {transactionToEdit && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          transaction={transactionToEdit}
          categories={categories} // Pass your categories here
        />
      )}
    </S.PageContainer>


  );
}