'use client';

import { format } from 'date-fns';
import React, { useRef, useState } from 'react';
import { FiCamera, FiCheck } from 'react-icons/fi';
import type { ParsedReceipt, ReceiptItem } from '@/app/actions/parseReceipt';
import { Category } from '@/app/hooks/useCategories';
import { useTranslation } from '@/app/i18n/LanguageContext';
import CategoryAutocomplete from '../CategoryAutocomplete';
import * as S from './styles';

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
            const res = await fetch('/api/receipt/parse', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            const result = await res.json();

            if (!result.success) {
                    const err = result.error ?? '';
                    const isTimeout = err.includes('timed out') || err.includes('timeout') || err === 'REQUEST_TIMEOUT';
                    const isTooLarge = err.includes('too large') || err.includes('10MB') || err.includes('Payload');
                    const errorMap: Record<string, string> = {
                        NOT_A_RECEIPT: scan.notAReceipt,
                        RATE_LIMIT: scan.rateLimitError,
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

                    const allIndexes = new Set(result.data.items.map((_, i) => i));
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
        const newCat = await addCategory(name);
        if (newCat?._id) {
            setCategoryId(newCat._id);
            return newCat;
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

    return (
        <S.Overlay>
            <S.Container>
                <S.Header>
                    <h3>
                        <FiCamera size={20} />
                        {scan.title}
                    </h3>
                    <S.CloseButton onClick={handleClose}>✕</S.CloseButton>
                </S.Header>

                <S.Body>
                    {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

                    {step === 'upload' && (
                        <>
                            <S.UploadArea>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleFileChange}
                                />
                                <S.UploadIcon>
                                    <FiCamera size={24} />
                                </S.UploadIcon>
                                <S.UploadText>{scan.uploadText}</S.UploadText>
                                <S.UploadHint>{scan.uploadHint}</S.UploadHint>
                            </S.UploadArea>

                            <S.ButtonGroup>
                                <S.SecondaryButton onClick={handleClose}>
                                    {t.editModal.cancel}
                                </S.SecondaryButton>
                            </S.ButtonGroup>
                        </>
                    )}

                    {step === 'processing' && (
                        <S.ProcessingWrapper>
                            <S.Spinner />
                            <span>{scan.processing}</span>
                            {preview && <S.PreviewImage src={preview} alt="Receipt" />}
                        </S.ProcessingWrapper>
                    )}

                    {step === 'review' && receipt && (
                        <>
                            {preview && <S.PreviewImage src={preview} alt="Receipt" />}

                            <S.ReceiptInfo>
                                <S.ReceiptStoreName>{receipt.storeName}</S.ReceiptStoreName>
                                <S.ReceiptDate>{receipt.date}</S.ReceiptDate>
                                <S.ReceiptTotal>
                                    Total: {currencyToUse} {receipt.total.toFixed(2)}
                                </S.ReceiptTotal>
                                {receipt.suggestedCategory && (
                                    <S.SuggestedCategory>
                                        {scan.suggestedCategory}: {receipt.suggestedCategory}
                                    </S.SuggestedCategory>
                                )}
                            </S.ReceiptInfo>

                            <S.FormRow>
                                <S.FormLabel>{t.transactionForm.date}</S.FormLabel>
                                <S.EditableInput
                                    type="date"
                                    value={transactionDate}
                                    onChange={(e) => setTransactionDate(e.target.value)}
                                />
                            </S.FormRow>

                            <S.FormRow>
                                <S.FormLabel>{t.transactionForm.type}</S.FormLabel>
                                <S.TypeToggle>
                                    <S.TypeButton
                                        $active={transactionType === 'expense'}
                                        $variant="expense"
                                        onClick={() => setTransactionType('expense')}
                                    >
                                        {t.transactions.expense}
                                    </S.TypeButton>
                                    <S.TypeButton
                                        $active={transactionType === 'income'}
                                        $variant="income"
                                        onClick={() => setTransactionType('income')}
                                    >
                                        {t.transactions.income}
                                    </S.TypeButton>
                                </S.TypeToggle>
                            </S.FormRow>

                            {receipt.items.length > 1 && (
                                <S.ModeSelector>
                                    <S.ModeLabel>{scan.saveAs}</S.ModeLabel>
                                    <S.ModeOptions>
                                        <S.ModeButton
                                            $active={mode === 'total'}
                                            onClick={() => setMode('total')}
                                        >
                                            {scan.modeTotal}
                                        </S.ModeButton>
                                        <S.ModeButton
                                            $active={mode === 'items'}
                                            onClick={() => setMode('items')}
                                        >
                                            {scan.modeItems}
                                        </S.ModeButton>
                                    </S.ModeOptions>
                                </S.ModeSelector>
                            )}

                            {mode === 'total' && (
                                <S.FormRow>
                                    <S.FormLabel>{t.transactionForm.description}</S.FormLabel>
                                    <S.EditableInput
                                        type="text"
                                        value={totalDescription}
                                        onChange={(e) => setTotalDescription(e.target.value)}
                                        placeholder={scan.receiptPurchase}
                                    />
                                </S.FormRow>
                            )}

                            {mode === 'items' && (
                                <>
                                    <S.SelectedCount>
                                        {scan.selectedCount
                                            .replace('{selected}', String(selectedItems.size))
                                            .replace('{total}', String(receipt.items.length))}
                                        {' '}
                                        <button
                                            type="button"
                                            onClick={toggleAllItems}
                                            style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit', fontSize: 'inherit' }}
                                        >
                                            {selectedItems.size === receipt.items.length
                                                ? scan.deselectAll
                                                : scan.selectAll}
                                        </button>
                                    </S.SelectedCount>

                                    <S.ItemsList>
                                        {editedItems.map((item, i) => (
                                            <S.ItemCard
                                                key={`${i}-${item.amount}`}
                                                $selected={selectedItems.has(i)}
                                            >
                                                <S.ItemCheckbox
                                                    $checked={selectedItems.has(i)}
                                                    onClick={() => toggleItem(i)}
                                                >
                                                    {selectedItems.has(i) ? <FiCheck size={14} /> : null}
                                                </S.ItemCheckbox>
                                                <S.ItemDetails>
                                                    <S.ItemEditableInput
                                                        type="text"
                                                        value={item.description}
                                                        onChange={(e) => updateItemDescription(i, e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    {item.quantity != null && item.quantity > 1 && (
                                                        <S.ItemQuantity>x{item.quantity}</S.ItemQuantity>
                                                    )}
                                                </S.ItemDetails>
                                                <S.ItemAmount>
                                                    {currencyToUse} {(item.amount * (item.quantity || 1)).toFixed(2)}
                                                </S.ItemAmount>
                                            </S.ItemCard>
                                        ))}
                                    </S.ItemsList>
                                </>
                            )}

                            <S.FormRow>
                                <S.FormLabel>{t.transactionForm.category}</S.FormLabel>
                                <CategoryAutocomplete
                                    categories={categories}
                                    selectedId={categoryId}
                                    onSelect={(id) => setCategoryId(id)}
                                    onCreateNew={handleCreateCategory}
                                />
                            </S.FormRow>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={isFixed}
                                    onChange={(e) => setIsFixed(e.target.checked)}
                                    style={{ width: '1.1rem', height: '1.1rem', cursor: 'pointer' }}
                                />
                                {t.transactionForm.fixedTransaction}
                            </label>

                            <S.ButtonGroup>
                                <S.PrimaryButton onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? t.common.processing : scan.saveButton}
                                </S.PrimaryButton>
                                <S.SecondaryButton onClick={() => { reset(); }}>
                                    {scan.scanAnother}
                                </S.SecondaryButton>
                            </S.ButtonGroup>
                        </>
                    )}
                </S.Body>
            </S.Container>
        </S.Overlay>
    );
};

export default ReceiptScannerModal;
