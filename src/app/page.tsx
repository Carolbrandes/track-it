'use client';
import { exportToCSV, exportToPDF, exportToXML } from '@/app/utils/exportData';
import { useQueryClient } from '@tanstack/react-query';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { useCallback, useRef, useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { FiCamera } from 'react-icons/fi';
import AddTransactionModal from './components/AddTransactionModal';
import ReceiptScannerModal from './components/ReceiptScannerModal';
import { Filter, type FilterHandle } from './components/Filter';
import { FilterTags } from './components/FilterTags';
import Modal from './components/Modal';
import { Pagination } from './components/Pagination';
import { Summary } from './components/Summary';
import { TransactionList } from './components/TransactionList';
import { useCategories } from './hooks/useCategories';
import { useDeviceDetect } from './hooks/useDeviceDetect';
import { useTransactions } from './hooks/useTransactions';
import { useUserData } from './hooks/useUserData';
import { useTranslation } from './i18n/LanguageContext';

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


function getDefaultDateFilters() {
  const now = new Date();
  return {
    startDate: format(startOfMonth(now), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(now), 'yyyy-MM-dd'),
  };
}

export default function Home() {
  const { t } = useTranslation();
  const { data: userData } = useUserData();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useState({
    description: '',
    category: '',
    type: '',
    minAmount: '',
    maxAmount: '',
    ...getDefaultDateFilters(),
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
    deleteTransaction,
    deleteTransactions,
    isDeletingMany
  } = useTransactions(
    userData?._id,
    currentPage,
    pageSize,
    filters
  );

  const { categories, addCategory: addCategoryMutation } = useCategories(userData?._id);
  const queryClient = useQueryClient();
  const { isMobile } = useDeviceDetect();
  const filterRef = useRef<FilterHandle>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const updatedFilters = { ...prev, [name]: value };
      if (name === 'startDate' && !updatedFilters.endDate) updatedFilters.endDate = value;
      return updatedFilters;
    });
    setCurrentPage(1);
  };

  const applyFilters = useCallback((newFilters: Record<string, string>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
    if (userData?._id) {
      queryClient.invalidateQueries({ queryKey: ['transactions', userData._id] });
      queryClient.invalidateQueries({ queryKey: ['allTransactions', userData._id] });
    }
  }, [queryClient, userData?._id]);

  const removeFilter = useCallback((key: string) => {
    const defaultFilters = getDefaultDateFilters();
    setFilters(prev => {
      const next = { ...prev };
      if (key === 'dateRange') {
        next.startDate = defaultFilters.startDate;
        next.endDate = defaultFilters.endDate;
      } else if (key === 'type') next.type = '';
      else if (key === 'category') next.category = '';
      else if (key === 'description') next.description = '';
      else if (key === 'minAmount') next.minAmount = '';
      else if (key === 'maxAmount') next.maxAmount = '';
      else if (key === 'isFixed') next.isFixed = '';
      return next;
    });
    setCurrentPage(1);
    if (userData?._id) {
      queryClient.invalidateQueries({ queryKey: ['transactions', userData._id] });
      queryClient.invalidateQueries({ queryKey: ['allTransactions', userData._id] });
    }
  }, [queryClient, userData?._id]);

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

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await deleteTransactions(ids);
    } catch (err) {
      console.error('Error deleting transactions:', err);
      alert(t.transactions.deleteError || 'Error deleting transactions');
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

  const handleExport = (exportFormat: 'csv' | 'xml' | 'pdf') => {
    const filename = `transactions_${format(new Date(), 'yyyy-MM-dd')}`;
    const dataForExport = allTransactions.map((t: any) => ({
      date: t.date,
      description: t.description,
      amount: t.amount,
      type: t.type,
      category: t.category,
      currency: t.currency,
    }));

    if (exportFormat === 'csv') exportToCSV(dataForExport, filename);
    if (exportFormat === 'xml') exportToXML(dataForExport, filename);
    if (exportFormat === 'pdf') exportToPDF(dataForExport, filename);
  };

  const resetFilters = useCallback(() => {
    const defaultFilters = {
      description: '',
      category: '',
      type: '',
      minAmount: '',
      maxAmount: '',
      ...getDefaultDateFilters(),
      isFixed: '',
    };
    setFilters(defaultFilters);
    setCurrentPage(1);
    if (userData?._id) {
      queryClient.invalidateQueries({ queryKey: ['transactions', userData._id] });
      queryClient.invalidateQueries({ queryKey: ['allTransactions', userData._id] });
    }
  }, [queryClient, userData?._id]);

  if (!userData) return null;
  if (isLoading) return <div className="text-center p-8 text-lg text-text-secondary">{t.common.loading}</div>;
  if (isError) return <div className="text-danger bg-surface p-4 rounded-lg mb-4 border border-danger">{error?.message}</div>;

  return (
    <div className="p-4 w-full min-w-0 overflow-x-hidden flex-1 md:p-8 md:max-w-[1400px] md:mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <h1 className="text-[1.75rem] text-text-primary">{t.transactions.title}</h1>
        <div className="flex flex-col gap-3 w-full md:w-auto md:flex-row md:gap-2">
          <div className="flex gap-2">
            <div className="flex items-center bg-surface border border-primary rounded-[10px] overflow-hidden">
              <button
                onClick={() => handleExport('csv')}
                className="px-3 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors border-r border-primary/20"
                title="Export as CSV"
              >
                CSV
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="px-3 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                title="Export as PDF"
              >
                PDF
              </button>
            </div>
            <button
              className="flex items-center gap-1.5 px-4 py-2 bg-surface text-primary border border-primary rounded-[10px] text-sm font-semibold font-[inherit] cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-primary hover:text-white"
              onClick={() => setIsScanModalOpen(true)}
            >
              <FiCamera size={18} />
              {t.receiptScanner.scanButton}
            </button>
          </div>
          <button
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-white border-none rounded-[10px] text-sm font-semibold font-[inherit] cursor-pointer transition-opacity duration-200 whitespace-nowrap hover:opacity-[0.88] md:w-auto w-full"
            onClick={() => setIsAddModalOpen(true)}
          >
            <IoAdd size={20} />
            {t.transactionForm.addButton}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <Summary transactions={allTransactions} totalCount={totalCount} />
      </div>

      <div className="mb-8">
        <Filter
          ref={filterRef}
          filters={filters}
          categories={categories}
          handleFilterChange={handleFilterChange}
          resetFilters={resetFilters}
          applyFilters={applyFilters}
          removeFilter={removeFilter}
          hideButton={isMobile}
        />
      </div>

      <TransactionList
        transactions={transactions as TransactionToEdit[]}
        isDeleting={isDeleting}
        isUpdating={isUpdating}
        isBulkDeleting={isDeletingMany}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleBulkDelete={handleBulkDelete}
        filterTags={<FilterTags filters={filters} categories={categories} resetFilters={resetFilters} removeFilter={removeFilter} />}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        onOpenFilter={isMobile ? () => filterRef.current?.open() : undefined}
      />

      <div className="mb-8">
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
        )}
      </div>

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
    </div>
  );
}
