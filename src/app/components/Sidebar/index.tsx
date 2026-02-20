"use client";

import { useEffect, useRef, useState } from "react";
import { BsPiggyBank } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { FiPieChart, FiSettings } from "react-icons/fi";
import { IoMdClose, IoMdList } from "react-icons/io";
import { LuLayoutList } from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from '../../i18n/LanguageContext';
import { Avatar } from "./components/Avatar";
import { CurrencySelect } from "./components/CurrencySelect";
import { LanguageSelect } from "./components/LanguageSelect";
import { ThemeButton } from "./components/ThemeButton";
import * as S from './styles';

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
        <S.NavbarContainer>
            <S.NavbarInner>
                <S.MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <IoMdClose size={22} /> : <IoMdList size={22} />}
                </S.MobileMenuButton>

                <S.Logo href="/">
                    <BsPiggyBank size={24} />
                    <span>Track It</span>
                </S.Logo>

                <S.DesktopNav>
                    {navItems.map(item => (
                        <S.NavPill key={item.href} href={item.href} $active={pathname === item.href}>
                            {item.icon}
                            {item.label}
                        </S.NavPill>
                    ))}
                </S.DesktopNav>

                <S.NavRight>
                    <S.DesktopAvatar>
                        <Avatar />
                    </S.DesktopAvatar>

                    <S.SettingsArea ref={settingsRef}>
                        <S.SettingsButton onClick={() => setSettingsOpen(!settingsOpen)}>
                            <FiSettings size={18} />
                        </S.SettingsButton>

                        {settingsOpen && (
                            <S.UserDropdown>
                                <S.MobileOnlyDropdownItem>
                                    <Avatar />
                                </S.MobileOnlyDropdownItem>
                                <S.MobileOnlyDivider />
                                <S.DropdownItem>
                                    <ThemeButton />
                                </S.DropdownItem>
                                <S.DropdownItem>
                                    <CurrencySelect />
                                </S.DropdownItem>
                                <S.DropdownItem>
                                    <LanguageSelect />
                                </S.DropdownItem>
                                <S.DropdownDivider />
                                <S.DropdownItem onClick={handleLogout}>
                                    <CiLogout size={16} />
                                    <span>{t.sidebar.logout}</span>
                                </S.DropdownItem>
                            </S.UserDropdown>
                        )}
                    </S.SettingsArea>
                </S.NavRight>
            </S.NavbarInner>

            {mobileMenuOpen && (
                <S.MobileNav>
                    {navItems.map(item => (
                        <S.MobileNavPill
                            key={item.href}
                            href={item.href}
                            $active={pathname === item.href}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.icon}
                            {item.label}
                        </S.MobileNavPill>
                    ))}
                </S.MobileNav>
            )}
        </S.NavbarContainer>
    );
};
