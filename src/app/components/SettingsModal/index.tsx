'use client';

import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useDateFormat } from '../../contexts/DateFormatContext';
import type { DateFormatPreference } from '../../contexts/DateFormatContext';
import { useTranslation } from '../../i18n/LanguageContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDeleteAll: () => void;
    onDeleteSelected: () => void;
    onEnterSelectionMode: () => void;
    onCancelSelection: () => void;
    isSelectionMode: boolean;
    selectedCount: number;
    totalCount: number;
    isBulkDeleting: boolean;
}

export function SettingsModal({
    isOpen,
    onClose,
    onDeleteAll,
    onDeleteSelected,
    onEnterSelectionMode,
    onCancelSelection,
    isSelectionMode,
    selectedCount,
    totalCount,
    isBulkDeleting,
}: SettingsModalProps) {
    const { t } = useTranslation();
    const { dateFormat, setDateFormat } = useDateFormat();

    if (!isOpen) return null;

    const labels: Record<DateFormatPreference, string> = {
        'mm/dd/yyyy': t.myData.dateFormatMmDd,
        'dd/mm/yyyy': t.myData.dateFormatDdMm,
        'long': t.myData.dateFormatLong,
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-surface w-full max-w-[360px] rounded-2xl shadow-xl border border-gray-200">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-text-primary m-0">{t.transactions.settingsModalTitle}</h3>
                    <button
                        type="button"
                        className="w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:bg-gray-200 hover:text-text-primary transition-colors text-xl font-medium"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="p-4 space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-text-secondary mb-2">{t.myData.dateFormat}</label>
                        <select
                            className="w-full py-2.5 px-3 rounded-lg text-[0.9rem] font-[inherit] border border-gray-300 bg-surface text-text-primary outline-none hover:border-primary focus:border-primary"
                            value={dateFormat}
                            onChange={(e) => setDateFormat(e.target.value as DateFormatPreference)}
                        >
                            <option value="mm/dd/yyyy">{labels['mm/dd/yyyy']}</option>
                            <option value="dd/mm/yyyy">{labels['dd/mm/yyyy']}</option>
                            <option value="long">{labels['long']}</option>
                        </select>
                    </div>

                    <div className="pt-2 border-t border-gray-200 space-y-2">
                        <button
                            onClick={() => {
                                onDeleteAll();
                                onClose();
                            }}
                            disabled={isBulkDeleting || totalCount === 0}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-[0.85rem] font-medium text-danger border border-danger rounded-lg hover:bg-danger hover:text-white transition-colors disabled:opacity-50"
                        >
                            <FiTrash2 size={14} />
                            {t.transactions.deleteAll || 'Delete All'}
                        </button>
                        {isSelectionMode ? (
                            <>
                                <button
                                    onClick={() => {
                                        onDeleteSelected();
                                        onClose();
                                    }}
                                    disabled={isBulkDeleting || selectedCount === 0}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-[0.85rem] font-medium text-white bg-danger border border-danger rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    <FiTrash2 size={14} />
                                    {t.transactions.deleteSelected || 'Delete Selected'} ({selectedCount})
                                </button>
                                <button
                                    onClick={() => {
                                        onCancelSelection();
                                        onClose();
                                    }}
                                    className="w-full py-2.5 px-3 text-[0.85rem] font-medium text-text-secondary border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    {t.editModal.cancel}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    onEnterSelectionMode();
                                    onClose();
                                }}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-[0.85rem] font-medium text-danger border border-danger rounded-lg hover:bg-danger hover:text-white transition-colors"
                            >
                                <FiTrash2 size={14} />
                                {t.transactions.deleteSelected || 'Delete Selected'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
