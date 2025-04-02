'use client'

import * as S from './styles';

interface PaginationProps {
    handlePageChange: (page: number) => void
    currentPage: number
    totalPages: number
}

export const Pagination = ({ currentPage, totalPages, handlePageChange }: PaginationProps) => {
    return (
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
    );
};
