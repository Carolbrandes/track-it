"use client";

import { useState } from "react";
import { BsPiggyBank } from "react-icons/bs";
import { FiPieChart } from "react-icons/fi";
import { IoMdClose, IoMdList } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { LuLayoutList } from "react-icons/lu";
import { useTranslation } from '../../i18n/LanguageContext';
import { Avatar } from "./components/Avatar";
import { CurrencySelect } from "./components/CurrencySelect";
import { LanguageSelect } from "./components/LanguageSelect";
import { Logout } from "./components/Logout";
import { ThemeButton } from "./components/ThemeButton";
import * as S from './styles';

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <S.HamburgerButton onClick={toggleSidebar}>
                {isOpen ? <IoMdClose /> : <IoMdList />}
            </S.HamburgerButton>

            <S.Overlay $isOpen={isOpen} onClick={toggleSidebar} />

            <S.SidebarContainer $isOpen={isOpen}>
                <S.LogoContainer>
                    <S.LogoText>Track It</S.LogoText>
                    <BsPiggyBank size={30} />
                </S.LogoContainer>

                <S.NavLink href="/" onClick={() => setIsOpen(false)}>
                    <IoMdList /> {t.sidebar.transactions}
                </S.NavLink>
                <S.NavLink href="/add-transaction" onClick={() => setIsOpen(false)}>
                    <IoAdd /> {t.sidebar.addTransaction}
                </S.NavLink>
                <S.NavLink href="/categories" onClick={() => setIsOpen(false)}>
                    <LuLayoutList /> {t.sidebar.categories}
                </S.NavLink>
                <S.NavLink href="/financial-analytics" onClick={() => setIsOpen(false)}>
                    <FiPieChart /> {t.sidebar.financialAnalytics}
                </S.NavLink>

                <S.UserSection>
                    <h4>{t.sidebar.userSettings}</h4>
                    <S.SettingsOption>
                        <Avatar />
                    </S.SettingsOption>
                    <S.SettingsOption>
                        <CurrencySelect />
                    </S.SettingsOption>
                    <S.SettingsOption>
                        <LanguageSelect />
                    </S.SettingsOption>
                    <Logout />
                    <S.SettingsOption>
                        <ThemeButton />
                    </S.SettingsOption>
                </S.UserSection>
            </S.SidebarContainer>
        </>
    );
};