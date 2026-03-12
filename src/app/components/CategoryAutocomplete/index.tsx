'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { IoAdd, IoChevronDown } from 'react-icons/io5';
import { Category } from '../../hooks/useCategories';
import { useTranslation } from '../../i18n/LanguageContext';
import { cn } from '@/app/lib/cn';

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
    const [isUserTyping, setIsUserTyping] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedCategory = categories.find(c => c._id === selectedId);

    useEffect(() => {
        if (selectedCategory && !isOpen) {
            setQuery(selectedCategory.name);
        }
    }, [selectedCategory, isOpen]);

    // Only filter when the user is actively typing; on open/focus show everything
    const filtered = isUserTyping && query.trim()
        ? categories.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
        : categories;

    const exactMatch = categories.some(c => c.name.toLowerCase() === query.trim().toLowerCase());
    const showCreateOption = isUserTyping && query.trim().length > 0 && !exactMatch;

    const handleSelect = useCallback((cat: Category) => {
        onSelect(cat._id);
        setQuery(cat.name);
        setIsOpen(false);
        setIsUserTyping(false);
    }, [onSelect]);

    const handleCreate = async () => {
        if (!query.trim() || isCreating) return;
        setIsCreating(true);
        try {
            const newCat = await onCreateNew(query.trim());
            if (newCat && newCat._id) {
                onSelect(newCat._id);
                setQuery(newCat.name);
                setIsOpen(false);
                setIsUserTyping(false);
            }
        } catch (error) {
            console.error('Failed to create category', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleChevronClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
            setIsUserTyping(false);
            if (selectedCategory) setQuery(selectedCategory.name);
        } else {
            setIsUserTyping(false);
            setIsOpen(true);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setIsUserTyping(false);
                if (selectedCategory) {
                    setQuery(selectedCategory.name);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [selectedCategory]);

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsUserTyping(true);
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        setIsUserTyping(false);
                        setIsOpen(true);
                    }}
                    placeholder={t.transactionForm.categorySearchPlaceholder}
                    className="w-full py-[0.6rem] pr-9 pl-3 text-[0.95rem] border border-gray-300 rounded-lg bg-surface text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/[0.13] placeholder:text-text-secondary"
                />
                <button
                    type="button"
                    onClick={handleChevronClick}
                    aria-label="Toggle category list"
                    className={cn(
                        'absolute right-2 flex items-center justify-center bg-transparent border-none cursor-pointer p-[0.2rem] text-text-secondary transition-[transform,color] duration-200 leading-none hover:text-primary',
                        isOpen && 'rotate-180'
                    )}
                >
                    <IoChevronDown size={16} />
                </button>
            </div>

            {isOpen && (
                <ul className="absolute top-full left-0 right-0 z-50 mt-1 p-0 list-none bg-surface border border-gray-300 rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] max-h-[200px] overflow-y-auto">
                    {filtered.map(cat => (
                        <li
                            key={cat._id}
                            onClick={() => handleSelect(cat)}
                            className={cn(
                                'py-[0.55rem] px-3 text-[0.9rem] cursor-pointer text-text-primary hover:bg-gray-200',
                                cat._id === selectedId ? 'bg-gray-200 font-semibold' : 'bg-transparent font-normal'
                            )}
                        >
                            {cat.name}
                        </li>
                    ))}

                    {showCreateOption && (
                        <li
                            onClick={handleCreate}
                            className="py-[0.55rem] px-3 text-[0.9rem] cursor-pointer text-primary font-semibold flex items-center gap-[0.4rem] border-t border-gray-300 hover:bg-gray-200"
                        >
                            <IoAdd size={16} />
                            {t.transactionForm.createCategory} &quot;{query.trim()}&quot;
                        </li>
                    )}

                    {filtered.length === 0 && !showCreateOption && (
                        <li className="py-[0.55rem] px-3 text-[0.85rem] text-text-secondary italic">
                            {t.categories.noCategoriesFound}
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}
