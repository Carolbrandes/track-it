import { useUserData } from '../../../../hooks/useUserData';
import * as S from './styles';


export const Avatar = () => {
    const { data, isLoading, isError } = useUserData();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching user data</div>;
    }

    return (

        <S.User>
            <S.UserAvatar>{data?.email?.charAt(0)?.toUpperCase()}</S.UserAvatar>
            <S.UserEmail>{data?.email?.match(/^([^@]{1,14})[^@]*@/)?.[1]}</S.UserEmail>
        </S.User>

    );
};
