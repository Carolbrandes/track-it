'use client';

import { useCategories } from '../hooks/useCategories';
import { useUserData } from '../hooks/useUserData';
import CategoryForm from './components/CategoryForm';
import CategoryList from './components/CategoryList';
import * as S from './styles';

export default function Categories() {
    const { data: userData } = useUserData()


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
            <S.Title>Manage Categories</S.Title>

            {isError && <S.ErrorMessage>{error?.message}</S.ErrorMessage>}


            <S.Section>
                <S.SectionTitle>Add New Category</S.SectionTitle>
                <CategoryForm onAdd={handleAddCategory} />
            </S.Section>

            <S.Section>
                <S.SectionTitle>Existing Categories</S.SectionTitle>
                {isLoading ? (
                    <S.LoadingIndicator>Loading...</S.LoadingIndicator>
                ) : categories && categories.length > 0 ? (
                    <CategoryList
                        categories={categories}
                    />
                ) : (<p>No categories were found</p>)}
            </S.Section>
        </S.PageContainer>
    );
}