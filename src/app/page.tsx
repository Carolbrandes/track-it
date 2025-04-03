'use client';
import { useState } from 'react';
import { Filter } from './components/Filter';
import Modal from './components/Modal';
import { Pagination } from './components/Pagination';
import { Summary } from './components/Summary';
import { TransactionList } from './components/TransactionList';
import { useCategories } from './hooks/useCategories';
import { useTransactions } from './hooks/useTransactions';
import { useUserData } from './hooks/useUserData';
import * as S from './styles';

export interface TransactionToEdit {
  _id: string
  description: string
  amount: number
  currency: string
  date: Date
  type: 'expense' | 'income'
  category: {
    _id: string
    name: string
    userId: string
    createdAt: string

  } | string,
  userId: string
  createdAt?: string
  updatedAt?: string

}


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
  const [transactionToEdit, setTransactionToEdit] = useState<TransactionToEdit | null>(null);

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


  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;


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

  const handleEdit = (transaction: TransactionToEdit) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {

    const isConfirmed = window.confirm('Are you sure you want to delete this transaction?');

    if (isConfirmed) {
      try {
        await deleteTransaction(id);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };


  const handleSave = async (updatedTransaction: TransactionToEdit) => {
    try {
      const payload = {
        ...updatedTransaction,
        date: typeof updatedTransaction.date === 'string'
          ? new Date(updatedTransaction.date)
          : updatedTransaction.date
      };

      await updateTransaction(updatedTransaction._id, payload);
      setIsModalOpen(false);
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
        <Summary transactions={transactions} totalCount={totalCount} />
      </S.Section>

      {/* Filters Section */}
      <S.Section>
        <Filter
          filters={filters}
          categories={categories}
          handleFilterChange={(e) => handleFilterChange(e)}
          resetFilters={resetFilters}
        />
      </S.Section>
      {/* Transactions Table */}
      <TransactionList
        transactions={transactions}
        isDeleting={isDeleting}
        isUpdating={isUpdating}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <S.Section>


        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
        )}
      </S.Section>

      {transactionToEdit && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          transaction={transactionToEdit}
          categories={categories}
        />
      )}
    </S.PageContainer>


  );
}