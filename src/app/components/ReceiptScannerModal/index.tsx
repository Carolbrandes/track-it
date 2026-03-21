'use client';

import { format } from 'date-fns';
import React, { useRef, useState } from 'react';
import { FiCamera, FiCheck } from 'react-icons/fi';
import type { ParsedReceipt, ReceiptItem } from '@/app/actions/parseReceipt';
import { Category } from '@/app/hooks/useCategories';
import { useTranslation } from '@/app/i18n/LanguageContext';
import { authFetch } from '@/app/lib/authFetch';
import { cn } from '@/app/lib/cn';
import CategoryAutocomplete from '../CategoryAutocomplete';

type SaveMode = 'items' | 'total';

interface ReceiptScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveTransactions: (transactions: Array<{
        description: string;
        amount: number;
        currency: string;
        date: Date;
        type: 'expense' | 'income';
        is_fixed: boolean;
        category: string;
    }>) => Promise<void>;
    categories: Category[];
    addCategory: (name: string) => Promise<Category | undefined>;
}

type Step = 'upload' | 'processing' | 'review';

function findBestCategoryMatch(suggestedName: string, categories: Category[]): string | null {
    if (!suggestedName || categories.length === 0) return null;

    const normalized = suggestedName.toLowerCase().trim();

    const exact = categories.find(c => c.name.toLowerCase().trim() === normalized);
    if (exact) return exact._id;

    const partial = categories.find(c =>
        c.name.toLowerCase().includes(normalized) ||
        normalized.includes(c.name.toLowerCase())
    );
    if (partial) return partial._id;

    return null;
}

const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({
    isOpen,
    onClose,
    onSaveTransactions,
    categories,
    addCategory,
}) => {
    const { t, locale } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [step, setStep] = useState<Step>('upload');
    const [preview, setPreview] = useState<string | null>(null);
    const [receipt, setReceipt] = useState<ParsedReceipt | null>(null);
    const [detectedCurrency, setDetectedCurrency] = useState<string>('');
    const [transactionDate, setTransactionDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [mode, setMode] = useState<SaveMode>('total');
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [categoryId, setCategoryId] = useState('');
    const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
    const [totalDescription, setTotalDescription] = useState('');
    const [editedItems, setEditedItems] = useState<ReceiptItem[]>([]);
    const [isFixed, setIsFixed] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scan = t.receiptScanner;

    const reset = () => {
        setStep('upload');
        setPreview((prev) => {
            if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
            return null;
        });
        setReceipt(null);
        setDetectedCurrency('');
        setTransactionDate(format(new Date(), 'yyyy-MM-dd'));
        setMode('total');
        setSelectedItems(new Set());
        setCategoryId('');
        setTransactionType('expense');
        setTotalDescription('');
        setEditedItems([]);
        setIsFixed(false);
        setError(null);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
        if (!validTypes.includes(file.type)) {
            setError(scan.invalidFormat);
            return;
        }

        setError(null);
        setStep('processing');

        setPreview(URL.createObjectURL(file));

        const categoryNames = categories.map(c => c.name);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('locale', locale);
        formData.append('existingCategories', JSON.stringify(categoryNames));

        try {
            const res = await authFetch('/api/receipt/parse', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (res.status === 401) {
                return;
            }
            if (res.status === 413) {
                setError(scan.imageTooLarge);
                setStep('upload');
                return;
            }

            const result = await res.json().catch(() => ({ success: false, error: '' }));

            if (!result.success) {
                    const err = String(result.error ?? '');
                    const isTimeout = err.includes('timed out') || err.includes('timeout') || err === 'REQUEST_TIMEOUT';
                    const isTooLarge = err.includes('too large') || err.includes('10MB') || err.includes('Payload');
                    const errorMap: Record<string, string> = {
                        NOT_A_RECEIPT: scan.notAReceipt,
                        RATE_LIMIT: scan.rateLimitError,
                        Unauthorized: scan.sessionExpired,
                    };
                    let message = errorMap[err] || scan.genericError;
                    if (isTimeout) message = scan.timeoutError;
                    else if (isTooLarge) message = scan.imageTooLarge;
                    setError(message);
                    setStep('upload');
                    return;
                }

                if (result.data) {
                    setReceipt(result.data);
                    setDetectedCurrency(result.data.currency || '');
                    setTransactionType(result.data.type);
                    setTotalDescription(result.data.storeName || '');
                    setEditedItems([...result.data.items]);

                    const allIndexes = new Set<number>(result.data.items.map((_: ReceiptItem, i: number) => i));
                    setSelectedItems(allIndexes);

                    const matchedId = findBestCategoryMatch(result.data.suggestedCategory, categories);
                    setCategoryId(matchedId || categories[0]?._id || '');

                    setStep('review');
                }
        } catch {
            setError(scan.genericError);
            setStep('upload');
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const toggleItem = (index: number) => {
        setSelectedItems(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    const toggleAllItems = () => {
        if (!receipt) return;
        if (selectedItems.size === receipt.items.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(receipt.items.map((_, i) => i)));
        }
    };

    const updateItemDescription = (index: number, value: string) => {
        setEditedItems(prev => {
            const next = [...prev];
            next[index] = { ...next[index], description: value };
            return next;
        });
    };

    const handleCreateCategory = async (name: string): Promise<Category | void> => {
        try {
            const newCat = await addCategory(name);
            if (newCat?._id) {
                setCategoryId(newCat._id);
                return newCat;
            }
        } catch (error) {
            console.error('Failed to create category', error);
            setError(t.transactionForm.createError || 'Error creating category');
        }
    };

    const currencyToUse = detectedCurrency || 'BRL';

    const handleSave = async () => {
        if (!receipt || !categoryId) return;

        setIsSaving(true);
        setError(null);

        try {
            const dateToUse = new Date(transactionDate);

            if (mode === 'total') {
                await onSaveTransactions([{
                    description: totalDescription || scan.receiptPurchase,
                    amount: receipt.total,
                    currency: currencyToUse,
                    date: dateToUse,
                    type: transactionType,
                    is_fixed: isFixed,
                    category: categoryId,
                }]);
            } else {
                const items = editedItems
                    .filter((_, i) => selectedItems.has(i))
                    .map(item => ({
                        description: item.description,
                        amount: item.amount * (item.quantity || 1),
                        currency: currencyToUse,
                        date: dateToUse,
                        type: transactionType,
                        is_fixed: isFixed,
                        category: categoryId,
                    }));

                if (items.length === 0) {
                    setError(scan.noItemsSelected);
                    setIsSaving(false);
                    return;
                }

                await onSaveTransactions(items);
            }

            handleClose();
        } catch {
            setError(scan.saveError);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    const typeButtonClasses = (active: boolean, variant: 'expense' | 'income') => {
        const color = variant === 'expense' ? 'danger' : 'success';
        return cn(
            'flex-1 py-2 px-3 rounded-lg text-[0.85rem] font-medium cursor-pointer transition-all duration-200',
            active
                ? variant === 'expense'
                    ? 'border border-danger bg-danger/[0.08] text-danger'
                    : 'border border-success bg-success/[0.08] text-success'
                : 'border border-gray-300 bg-transparent text-text-secondary',
            !active && (color === 'danger' ? 'hover:border-danger' : 'hover:border-success')
        );
    };

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-center z-[200]">
            <div className="bg-surface rounded-[14px] w-[520px] max-w-[95%] max-h-[90vh] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-gray-300">
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-300">
                    <h3 className="m-0 text-[1.15rem] text-text-primary flex items-center gap-2">
                        <FiCamera size={20} />
                        {scan.title}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="bg-transparent border-none text-lg cursor-pointer text-text-secondary p-1 hover:text-text-primary"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    {error && (
                        <div className="text-danger text-[0.85rem] py-2 px-3 bg-danger/[0.07] rounded-lg border border-danger/20">
                            {error}
                        </div>
                    )}

                    {step === 'upload' && (
                        <>
                            <label className="flex flex-col items-center justify-center gap-3 py-10 px-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer transition-all duration-200 text-text-secondary bg-background hover:border-primary hover:text-primary hover:bg-primary/[0.03] [&>input]:hidden">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleFileChange}
                                />
                                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/[0.08] text-primary">
                                    <FiCamera size={24} />
                                </div>
                                <span className="text-[0.9rem] font-medium text-center">{scan.uploadText}</span>
                                <span className="text-[0.78rem] text-text-secondary">{scan.uploadHint}</span>
                            </label>

                            <div className="flex gap-3 mt-1">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 py-[0.65rem] text-[0.95rem] font-semibold border-none rounded-lg cursor-pointer transition-opacity duration-200 bg-gray-300 text-text-primary hover:opacity-85"
                                >
                                    {t.editModal.cancel}
                                </button>
                            </div>
                        </>
                    )}

                    {step === 'processing' && (
                        <div className="flex flex-col items-center gap-4 p-8 text-text-secondary">
                            <div className="w-10 h-10 border-[3px] border-gray-300 border-t-primary rounded-full animate-spin" />
                            <span>{scan.processing}</span>
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Receipt"
                                    className="max-w-full max-h-[200px] object-contain rounded-lg border border-gray-300"
                                />
                            )}
                        </div>
                    )}

                    {step === 'review' && receipt && (
                        <>
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Receipt"
                                    className="max-w-full max-h-[200px] object-contain rounded-lg border border-gray-300"
                                />
                            )}

                            <div className="flex flex-col gap-1 p-3 bg-background rounded-lg border border-gray-300">
                                <div className="font-semibold text-[0.95rem] text-text-primary">{receipt.storeName}</div>
                                <div className="text-[0.82rem] text-text-secondary">{receipt.date}</div>
                                <div className="text-[0.9rem] font-semibold text-primary mt-1">
                                    Total: {currencyToUse} {receipt.total.toFixed(2)}
                                </div>
                                {receipt.suggestedCategory && (
                                    <div className="text-[0.8rem] text-text-secondary mt-[0.15rem] italic">
                                        {scan.suggestedCategory}: {receipt.suggestedCategory}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-[0.3rem]">
                                <label className="text-[0.85rem] font-semibold text-text-secondary">{t.transactionForm.date}</label>
                                <input
                                    type="date"
                                    value={transactionDate}
                                    onChange={(e) => setTransactionDate(e.target.value)}
                                    className="py-[0.55rem] px-3 text-[0.9rem] border border-gray-300 rounded-lg bg-background text-text-primary transition-[border-color] duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/[0.13]"
                                />
                            </div>

                            <div className="flex flex-col gap-[0.3rem]">
                                <label className="text-[0.85rem] font-semibold text-text-secondary">{t.transactionForm.type}</label>
                                <div className="flex gap-2">
                                    <button
                                        className={typeButtonClasses(transactionType === 'expense', 'expense')}
                                        onClick={() => setTransactionType('expense')}
                                    >
                                        {t.transactions.expense}
                                    </button>
                                    <button
                                        className={typeButtonClasses(transactionType === 'income', 'income')}
                                        onClick={() => setTransactionType('income')}
                                    >
                                        {t.transactions.income}
                                    </button>
                                </div>
                            </div>

                            {receipt.items.length > 1 && (
                                <div className="flex flex-col gap-2">
                                    <div className="text-[0.85rem] font-semibold text-text-secondary uppercase tracking-[0.3px]">
                                        {scan.saveAs}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className={cn(
                                                'flex-1 py-[0.6rem] px-3 rounded-lg text-[0.85rem] font-medium cursor-pointer transition-all duration-200 hover:border-primary',
                                                mode === 'total'
                                                    ? 'border border-primary bg-primary/[0.08] text-primary'
                                                    : 'border border-gray-300 bg-transparent text-text-secondary'
                                            )}
                                            onClick={() => setMode('total')}
                                        >
                                            {scan.modeTotal}
                                        </button>
                                        <button
                                            className={cn(
                                                'flex-1 py-[0.6rem] px-3 rounded-lg text-[0.85rem] font-medium cursor-pointer transition-all duration-200 hover:border-primary',
                                                mode === 'items'
                                                    ? 'border border-primary bg-primary/[0.08] text-primary'
                                                    : 'border border-gray-300 bg-transparent text-text-secondary'
                                            )}
                                            onClick={() => setMode('items')}
                                        >
                                            {scan.modeItems}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {mode === 'total' && (
                                <div className="flex flex-col gap-[0.3rem]">
                                    <label className="text-[0.85rem] font-semibold text-text-secondary">{t.transactionForm.description}</label>
                                    <input
                                        type="text"
                                        value={totalDescription}
                                        onChange={(e) => setTotalDescription(e.target.value)}
                                        placeholder={scan.receiptPurchase}
                                        className="py-[0.55rem] px-3 text-[0.9rem] border border-gray-300 rounded-lg bg-background text-text-primary transition-[border-color] duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/[0.13]"
                                    />
                                </div>
                            )}

                            {mode === 'items' && (
                                <>
                                    <div className="text-[0.82rem] text-text-secondary text-center">
                                        {scan.selectedCount
                                            .replace('{selected}', String(selectedItems.size))
                                            .replace('{total}', String(receipt.items.length))}
                                        {' '}
                                        <button
                                            type="button"
                                            onClick={toggleAllItems}
                                            className="bg-transparent border-none text-inherit underline cursor-pointer p-0 font-[inherit] text-[inherit]"
                                        >
                                            {selectedItems.size === receipt.items.length
                                                ? scan.deselectAll
                                                : scan.selectAll}
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {editedItems.map((item, i) => (
                                            <div
                                                key={`${i}-${item.amount}`}
                                                className={cn(
                                                    'flex items-center gap-3 py-[0.6rem] px-3 rounded-lg cursor-pointer transition-all duration-150 hover:border-primary',
                                                    selectedItems.has(i)
                                                        ? 'border border-primary bg-primary/[0.04]'
                                                        : 'border border-gray-300 bg-transparent'
                                                )}
                                            >
                                                <div
                                                    onClick={() => toggleItem(i)}
                                                    className={cn(
                                                        'w-5 h-5 min-w-[20px] rounded border-2 flex items-center justify-center text-white text-xs transition-all duration-150',
                                                        selectedItems.has(i)
                                                            ? 'border-primary bg-primary'
                                                            : 'border-gray-300 bg-transparent'
                                                    )}
                                                >
                                                    {selectedItems.has(i) ? <FiCheck size={14} /> : null}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <input
                                                        type="text"
                                                        value={item.description}
                                                        onChange={(e) => updateItemDescription(i, e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="w-full py-1 px-[0.4rem] text-[0.85rem] border border-transparent rounded bg-transparent text-text-primary transition-all duration-150 hover:border-gray-300 hover:bg-background focus:outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/[0.13]"
                                                    />
                                                    {item.quantity != null && item.quantity > 1 && (
                                                        <span className="text-[0.75rem] text-text-secondary">x{item.quantity}</span>
                                                    )}
                                                </div>
                                                <div className="text-[0.88rem] font-semibold text-text-primary whitespace-nowrap">
                                                    {currencyToUse} {(item.amount * (item.quantity || 1)).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            <div className="flex flex-col gap-[0.3rem]">
                                <label className="text-[0.85rem] font-semibold text-text-secondary">{t.transactionForm.category}</label>
                                <CategoryAutocomplete
                                    categories={categories}
                                    selectedId={categoryId}
                                    onSelect={(id) => setCategoryId(id)}
                                    onCreateNew={handleCreateCategory}
                                />
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isFixed}
                                    onChange={(e) => setIsFixed(e.target.checked)}
                                    className="w-[1.1rem] h-[1.1rem] cursor-pointer"
                                />
                                {t.transactionForm.fixedTransaction}
                            </label>

                            <div className="flex gap-3 mt-1">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 py-[0.65rem] text-[0.95rem] font-semibold border-none rounded-lg cursor-pointer transition-opacity duration-200 bg-primary text-white hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? t.common.processing : scan.saveButton}
                                </button>
                                <button
                                    onClick={() => { reset(); }}
                                    className="flex-1 py-[0.65rem] text-[0.95rem] font-semibold border-none rounded-lg cursor-pointer transition-opacity duration-200 bg-gray-300 text-text-primary hover:opacity-85"
                                >
                                    {scan.scanAnother}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReceiptScannerModal;
