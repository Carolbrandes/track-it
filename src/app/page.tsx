'use client';
import { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { FiCamera } from 'react-icons/fi';
import AddTransactionModal from './components/AddTransactionModal';
import ReceiptScannerModal from './components/ReceiptScannerModal';
import { Filter } from './components/Filter';
import Modal from './components/Modal';
import { Pagination } from './components/Pagination';
import { Summary } from './components/Summary';
import { TransactionList } from './components/TransactionList';
import { useCategories } from './hooks/useCategories';
import { useTransactions } from './hooks/useTransactions';
import { useUserData } from './hooks/useUserData';
import { useTranslation } from './i18n/LanguageContext';
import * as S from './styles';

export interface TransactionToEdit {
  _id: string
  description: string
  amount: number
  currency: string
  date: Date
  type: 'expense' | 'income'
  is_fixed?: boolean | null
  category: string | { _id: string; name: string; createdAt?: Date | string }
  userId: string
  createdAt?: string
  updatedAt?: string
}


export default function Home() {
  const { t } = useTranslation();
  const { data: userData } = useUserData();
  const [currentPage, setCurrentPage] = useState(1);

  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const [fixedOnly, setFixedOnly] = useState(false);
  const [filters, setFilters] = useState({
    description: '',
    category: '',
    type: '',
    minAmount: '',
    maxAmount: '',
    startDate: new Date(year, month - 1, 1).toISOString().slice(0, 10),
    endDate: new Date(year, month, 0).toISOString().slice(0, 10)
  });
  const [transactionToEdit, setTransactionToEdit] = useState<TransactionToEdit | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const {
    transactions,
    allTransactions,
    totalCount,
    totalPages,
    isLoading,
    isError,
    error,
    isDeleting,
    isUpdating,
    addTransaction,
    updateTransaction,
    deleteTransaction
  } = useTransactions(
    userData?._id,
    currentPage,
    10,
    filters
  );

  const { categories, addCategory: addCategoryMutation } = useCategories(userData?._id);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFilters(prev => {
      const updatedFilters = { ...prev, [name]: value };
      if (name === "startDate" && !updatedFilters.endDate) {
        updatedFilters.endDate = value;
      }
      return updatedFilters;
    });

    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (transaction: TransactionToEdit) => {
    setTransactionToEdit(transaction);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm(t.transactions.confirmDelete);
    if (isConfirmed) {
      try {
        await deleteTransaction(id);
        setIsEditModalOpen(false);
      } catch (err) {
        console.error('Error deleting transaction:', err);
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
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating transaction:', err);
    }
  };

  const handleAddTransaction = async (transaction: {
    description: string;
    amount: number;
    currency: string;
    date: Date;
    type: 'expense' | 'income';
    is_fixed: boolean;
    category: string;
  }) => {
    await addTransaction({
      ...transaction,
      userId: userData?._id,
    });
  };

  const handleScanTransactions = async (transactions: Array<{
    description: string;
    amount: number;
    currency: string;
    date: Date;
    type: 'expense' | 'income';
    is_fixed: boolean;
    category: string;
  }>) => {
    for (const txn of transactions) {
      await addTransaction({
        ...txn,
        userId: userData?._id,
      });
    }
  };

  const resetFilters = () => {
    setFixedOnly(false);
    setFilters({
      description: '',
      category: '',
      type: '',
      minAmount: '',
      maxAmount: '',
      startDate: new Date(year, month - 1, 1).toISOString().slice(0, 10),
      endDate: new Date(year, month, 0).toISOString().slice(0, 10)
    });
    setCurrentPage(1);
  };

  if (!userData) return null;
  if (isLoading) return <S.LoadingIndicator>{t.common.loading}</S.LoadingIndicator>;
  if (isError) return <S.ErrorMessage>{error?.message}</S.ErrorMessage>;

  return (
    <S.PageContainer>
      <S.TitleRow>
        <S.Title>{t.transactions.title}</S.Title>
        <S.ButtonRow>
          <S.ScanButton onClick={() => setIsScanModalOpen(true)}>
            <FiCamera size={18} />
            {t.receiptScanner.scanButton}
          </S.ScanButton>
          <S.AddButton onClick={() => setIsAddModalOpen(true)}>
            <IoAdd size={20} />
            {t.transactionForm.addButton}
          </S.AddButton>
        </S.ButtonRow>
      </S.TitleRow>

      <S.Section>
        <Summary transactions={allTransactions} totalCount={totalCount} />
      </S.Section>

      <S.Section>
        <Filter
          filters={{ ...filters, fixedOnly }}
          categories={categories}
          handleFilterChange={(e) => handleFilterChange(e)}
          onFixedOnlyChange={(checked) => { setFixedOnly(checked); setCurrentPage(1); }}
          resetFilters={resetFilters}
        />
      </S.Section>

      <TransactionList
        transactions={(fixedOnly ? transactions.filter(t => t.is_fixed) : transactions) as TransactionToEdit[]}
        isDeleting={isDeleting}
        isUpdating={isUpdating}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <S.Section>
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
        )}
      </S.Section>

      {transactionToEdit && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
          transaction={transactionToEdit}
          categories={categories}
        />
      )}

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTransaction}
        categories={categories}
        addCategory={async (name) => {
          const result = await addCategoryMutation(name);
          return result ?? undefined;
        }}
      />

      <ReceiptScannerModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onSaveTransactions={handleScanTransactions}
        categories={categories}
        addCategory={async (name) => {
          const result = await addCategoryMutation(name);
          return result ?? undefined;
        }}
      />
    </S.PageContainer>
  );
}
