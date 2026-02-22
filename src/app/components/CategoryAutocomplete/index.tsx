'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { Category } from '../../hooks/useCategories';
import { useTranslation } from '../../i18n/LanguageContext';
import * as S from './styles';

interface CategoryAutocompleteProps {
    readonly categories: Category[];
    readonly selectedId: string;
    readonly onSelect: (categoryId: string) => void;
    readonly onCreateNew: (name: string) => Promise<Category | void>;
}

export default function CategoryAutocomplete({
    categories,
    selectedId,
    onSelect,
    onCreateNew,
}: CategoryAutocompleteProps) {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedCategory = categories.find(c => c._id === selectedId);

    useEffect(() => {
        if (selectedCategory && !isOpen) {
            setQuery(selectedCategory.name);
        }
    }, [selectedCategory, isOpen]);

    const filtered = query.trim()
        ? categories.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
        : categories;

    const exactMatch = categories.some(c => c.name.toLowerCase() === query.trim().toLowerCase());
    const showCreateOption = query.trim().length > 0 && !exactMatch;

    const handleSelect = useCallback((cat: Category) => {
        onSelect(cat._id);
        setQuery(cat.name);
        setIsOpen(false);
    }, [onSelect]);

    const handleCreate = async () => {
        if (!query.trim() || isCreating) return;
        setIsCreating(true);
        try {
            const newCat = await onCreateNew(query.trim());
            if (newCat && newCat._id) {
                onSelect(newCat._id);
                setQuery(newCat.name);
            }
            setIsOpen(false);
        } finally {
            setIsCreating(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                if (selectedCategory) {
                    setQuery(selectedCategory.name);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [selectedCategory]);

    return (
        <S.Container ref={containerRef}>
            <S.SearchInput
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={t.transactionForm.categorySearchPlaceholder}
            />

            {isOpen && (
                <S.Dropdown>
                    {filtered.map(cat => (
                        <S.DropdownItem
                            key={cat._id}
                            $isSelected={cat._id === selectedId}
                            onClick={() => handleSelect(cat)}
                        >
                            {cat.name}
                        </S.DropdownItem>
                    ))}

                    {showCreateOption && (
                        <S.CreateItem onClick={handleCreate}>
                            <IoAdd size={16} />
                            {t.transactionForm.createCategory} &quot;{query.trim()}&quot;
                        </S.CreateItem>
                    )}

                    {filtered.length === 0 && !showCreateOption && (
                        <S.EmptyItem>{t.categories.noCategoriesFound}</S.EmptyItem>
                    )}
                </S.Dropdown>
            )}
        </S.Container>
    );
}
