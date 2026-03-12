'use client'

import { cn } from '@/app/lib/cn';
import { useTranslation } from '../../i18n/LanguageContext';

interface PaginationProps {
    handlePageChange: (page: number) => void
    currentPage: number
    totalPages: number
}

export const Pagination = ({ currentPage, totalPages, handlePageChange }: PaginationProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex justify-center gap-2 mt-8">
            <button
                className={cn(
                    "py-2 px-[0.85rem] rounded-lg cursor-pointer font-[inherit] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                    "bg-surface text-text-primary border border-gray-300 hover:bg-gray-200"
                )}
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                {t.pagination.previous}
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    className={cn(
                        "py-2 px-[0.85rem] rounded-lg cursor-pointer font-[inherit] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                        page === currentPage
                            ? "bg-primary text-white border border-primary hover:bg-primary"
                            : "bg-surface text-text-primary border border-gray-300 hover:bg-gray-200"
                    )}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </button>
            ))}

            <button
                className={cn(
                    "py-2 px-[0.85rem] rounded-lg cursor-pointer font-[inherit] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                    "bg-surface text-text-primary border border-gray-300 hover:bg-gray-200"
                )}
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                {t.pagination.next}
            </button>
        </div>
    );
};
