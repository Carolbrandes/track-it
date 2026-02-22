'use client'

import { useTranslation } from '../../i18n/LanguageContext';
import * as S from './styles';

interface PaginationProps {
    handlePageChange: (page: number) => void
    currentPage: number
    totalPages: number
}

export const Pagination = ({ currentPage, totalPages, handlePageChange }: PaginationProps) => {
    const { t } = useTranslation();
    
    return (
        <S.Pagination>
            <S.PaginationButton
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                {t.pagination.previous}
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
                {t.pagination.next}
            </S.PaginationButton>
        </S.Pagination>
    );
};
