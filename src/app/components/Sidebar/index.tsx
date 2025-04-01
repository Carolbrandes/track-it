"use client";

import { FaPiggyBank } from 'react-icons/fa';
import { Avatar } from "./components/Avatar";
import { CurrencySelect } from "./components/CurrencySelect";
import { Logout } from "./components/Logout";
import { ThemeButton } from "./components/ThemeButton";
import * as S from './styles';



export const Sidebar = () => {


    return (
        <S.SidebarContainer>
            <S.LogoContainer>
                <FaPiggyBank size={30} />
                <S.LogoText>Track It</S.LogoText>
            </S.LogoContainer>

            <S.NavLink href="/">Transactions</S.NavLink>
            <S.NavLink href="/add-transaction">Add Transaction</S.NavLink>
            <S.NavLink href="/categories">Categories</S.NavLink>
            <S.NavLink href="/financial-analytics">Financial Analytics</S.NavLink>

            <S.UserSection>
                <h4>User Settings</h4>

                <S.SettingsOption>
                    <ThemeButton />
                </S.SettingsOption>

                <S.SettingsOption>
                    <CurrencySelect />
                </S.SettingsOption>


                <Logout />


                <Avatar />

            </S.UserSection>
        </S.SidebarContainer>
    );
};

