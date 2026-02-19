'use client'

import { useUserData } from '../../../../hooks/useUserData';
import { useTranslation } from '../../../../i18n/LanguageContext';
import * as S from './styles';


export const Avatar = () => {
    const { data, isLoading, isError } = useUserData();
    const { t } = useTranslation();

    if (isLoading) {
        return <div>{t.avatar.loading}</div>;
    }

    if (isError) {
        return <div>{t.avatar.error}</div>;
    }

    return (

        <S.User>
            <S.UserAvatar>{data?.email?.charAt(0)?.toUpperCase()}</S.UserAvatar>
            <S.UserEmail>{data?.email?.match(/^([^@]{1,14})[^@]*@/)?.[1]}</S.UserEmail>
        </S.User>

    );
};
