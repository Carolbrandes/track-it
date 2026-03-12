"use client";

import { useEffect, useRef, useState } from "react";
import { BsPiggyBank } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { FiPieChart, FiSettings } from "react-icons/fi";
import { IoMdClose, IoMdList } from "react-icons/io";
import { LuLayoutList } from "react-icons/lu";
import { MdPerson } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from '@/app/lib/cn';
import { useTranslation } from '../../i18n/LanguageContext';
import { Avatar } from "./components/Avatar";
import { CurrencySelect } from "./components/CurrencySelect";
import { LanguageSelect } from "./components/LanguageSelect";
import { ThemeButton } from "./components/ThemeButton";

export const Sidebar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { t } = useTranslation();
    const pathname = usePathname();
    const router = useRouter();
    const settingsRef = useRef<HTMLDivElement>(null);

    const navItems = [
        { href: '/', icon: <IoMdList size={16} />, label: t.sidebar.transactions },
        { href: '/categories', icon: <LuLayoutList size={16} />, label: t.sidebar.categories },
        { href: '/financial-analytics', icon: <FiPieChart size={16} />, label: t.sidebar.financialAnalytics },
    ];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
                setSettingsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        const response = await fetch('/api/logout', { method: 'POST' });
        if (response.ok) router.push('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-surface border-b border-gray-300">
            <div className="flex items-center h-[60px] px-4 md:px-6 max-w-[1400px] mx-auto gap-4">
                <button
                    className="flex items-center justify-center bg-transparent border-none text-primary cursor-pointer p-1 min-[860px]:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <IoMdClose size={22} /> : <IoMdList size={22} />}
                </button>

                <a href="/" className="flex items-center gap-2 no-underline text-primary font-bold text-lg shrink-0">
                    <BsPiggyBank size={24} />
                    <span>Track It</span>
                </a>

                <div className="hidden min-[860px]:flex items-center gap-1.5 ml-6">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-1 px-3.5 py-1.5 rounded-full text-sm font-medium no-underline cursor-pointer whitespace-nowrap transition-all duration-200",
                                pathname === item.href
                                    ? "bg-primary text-white"
                                    : "bg-transparent text-text-secondary hover:bg-gray-200 hover:text-text-primary"
                            )}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2.5 ml-auto">
                    <div className="hidden xl:flex items-center">
                        <Avatar />
                    </div>

                    <div ref={settingsRef} className="relative flex items-center">
                        <button
                            className="flex items-center justify-center w-9 h-9 rounded-[10px] border border-gray-300 bg-transparent text-text-secondary cursor-pointer transition-all duration-200 hover:border-primary hover:text-primary hover:bg-gray-200"
                            onClick={() => setSettingsOpen(!settingsOpen)}
                        >
                            <FiSettings size={18} />
                        </button>

                        {settingsOpen && (
                            <div className="absolute top-[calc(100%+8px)] right-0 min-w-[230px] bg-surface border border-gray-300 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-2 z-[200]">
                                <div className="px-3 py-2 text-[0.9rem] text-text-primary xl:hidden">
                                    <Avatar />
                                </div>
                                <div className="h-px bg-gray-300 my-1.5 xl:hidden" />
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[0.9rem] text-text-primary cursor-pointer transition-[background] duration-150 hover:bg-gray-200">
                                    <ThemeButton />
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[0.9rem] text-text-primary cursor-pointer transition-[background] duration-150 hover:bg-gray-200">
                                    <CurrencySelect />
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[0.9rem] text-text-primary cursor-pointer transition-[background] duration-150 hover:bg-gray-200">
                                    <LanguageSelect />
                                </div>
                                <Link href="/my-data" className="no-underline text-inherit" onClick={() => setSettingsOpen(false)}>
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[0.9rem] text-text-primary cursor-pointer transition-[background] duration-150 hover:bg-gray-200">
                                        <MdPerson size={16} />
                                        <span>{t.sidebar.myData}</span>
                                    </div>
                                </Link>
                                <div className="h-px bg-gray-300 my-1.5" />
                                <button
                                    type="button"
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-[0.9rem] text-text-primary cursor-pointer transition-[background] duration-150 hover:bg-gray-200 bg-transparent border-none w-full font-[inherit]"
                                    onClick={handleLogout}
                                >
                                    <CiLogout size={16} />
                                    <span>{t.sidebar.logout}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="flex flex-wrap gap-2 px-4 pb-4 pt-3 border-t border-gray-300 bg-surface min-[860px]:hidden">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium no-underline cursor-pointer transition-all duration-200",
                                pathname === item.href
                                    ? "bg-primary text-white"
                                    : "bg-gray-200 text-text-secondary"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};
