'use client';
import { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { FiCamera } from 'react-icons/fi';
import styled from 'styled-components';
import AddTransactionModal from './components/AddTransactionModal';
import ReceiptScannerModal from './components/ReceiptScannerModal';
import { Filter } from './components/Filter';
import Modal from './components/Modal';
import { Pagination } from './components/Pagination';
import { Summary } from './components/Summary';
import { TransactionList } from './components/TransactionList';
import { useDateFormat } from './contexts/DateFormatContext';
import type { DateFormatPreference } from './contexts/DateFormatContext';
import { useCategories } from './hooks/useCategories';
import { useTransactions } from './hooks/useTransactions';
import { useUserData } from './hooks/useUserData';
import { useTranslation } from './i18n/LanguageContext';
import * as S from './styles';

const DateFormatBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
`;

const DateFormatLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

const DateFormatBtn = styled.button<{ $active: boolean }>`
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-family: inherit;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  cursor: pointer;
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, $active }) => $active ? '#fff' : theme.colors.text};
  transition: all 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

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
  const { dateFormat, setDateFormat } = useDateFormat();
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    description: '',
    category: '',
    type: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
    isFixed: '',
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
      if (name === 'startDate' && !updatedFilters.endDate) {
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
    setFilters({
      description: '',
      category: '',
      type: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: '',
      isFixed: '',
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
          filters={filters}
          categories={categories}
          handleFilterChange={(e) => handleFilterChange(e)}
          resetFilters={resetFilters}
        />
      </S.Section>

      <DateFormatBar>
        <DateFormatLabel>{t.myData.dateFormat}:</DateFormatLabel>
        {(['mm/dd/yyyy', 'dd/mm/yyyy', 'long'] as DateFormatPreference[]).map((fmt) => {
          const labels: Record<DateFormatPreference, string> = {
            'mm/dd/yyyy': t.myData.dateFormatMmDd,
            'dd/mm/yyyy': t.myData.dateFormatDdMm,
            'long': t.myData.dateFormatLong,
          };
          return (
            <DateFormatBtn
              key={fmt}
              $active={dateFormat === fmt}
              onClick={() => setDateFormat(fmt)}
            >
              {labels[fmt]}
            </DateFormatBtn>
          );
        })}
      </DateFormatBar>

      <TransactionList
        transactions={transactions as TransactionToEdit[]}
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
