'use client';

import { useCategories } from '../hooks/useCategories';
import { useUserData } from '../hooks/useUserData';
import { useTranslation } from '../i18n/LanguageContext';
import CategoryForm from './components/CategoryForm';
import CategoryList from './components/CategoryList';
import * as S from './styles';

export default function Categories() {
    const { t } = useTranslation();
    const { data: userData } = useUserData();

    const {
        categories,
        isLoading,
        isError,
        error,
        addCategory
    } = useCategories(userData?._id);

    const handleAddCategory = (name: string) => {
        addCategory(name);
    };

    return (
        <S.PageContainer>
            <S.Title>{t.categories.title}</S.Title>

            {isError && <S.ErrorMessage>{error?.message}</S.ErrorMessage>}

            <S.Section>
                <S.SectionTitle>{t.categories.addNew}</S.SectionTitle>
                <S.Card>
                    <CategoryForm onAdd={handleAddCategory} />
                </S.Card>
            </S.Section>

            <S.Section>
                <S.SectionTitle>{t.categories.existing}</S.SectionTitle>
                <S.Card>
                    {isLoading ? (
                        <S.LoadingIndicator>{t.categories.loading}</S.LoadingIndicator>
                    ) : categories && categories.length > 0 ? (
                        <CategoryList categories={categories} />
                    ) : (
                        <S.EmptyMessage>{t.categories.noCategories}</S.EmptyMessage>
                    )}
                </S.Card>
            </S.Section>
        </S.PageContainer>
    );
}
