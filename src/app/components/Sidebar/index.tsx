"use client";

import { BsPiggyBank } from "react-icons/bs";
import { FiPieChart } from "react-icons/fi";
import { IoMdList } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { LuLayoutList } from "react-icons/lu";
import { Avatar } from "./components/Avatar";
import { CurrencySelect } from "./components/CurrencySelect";
import { Logout } from "./components/Logout";
import { ThemeButton } from "./components/ThemeButton";




import * as S from './styles';



export const Sidebar = () => {


    return (
        <S.SidebarContainer>
            <S.LogoContainer>
                <S.LogoText>Track It</S.LogoText>
                <BsPiggyBank size={30} />
            </S.LogoContainer>

            <S.NavLink href="/"> <IoMdList /> Transactions</S.NavLink>
            <S.NavLink href="/add-transaction"><IoAdd /> Add Transaction</S.NavLink>
            <S.NavLink href="/categories"> <LuLayoutList /> Categories</S.NavLink>
            <S.NavLink href="/financial-analytics"><FiPieChart />
                Financial Analytics</S.NavLink>

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

