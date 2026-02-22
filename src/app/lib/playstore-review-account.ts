/**
 * Conta de teste estática para revisão da Google Play Store.
 * Permite que o avaliador faça login sem receber e-mail real.
 *
 * Para desativar: altere isPlayStoreReviewLogin() para retornar false
 * ou remova as verificações nos endpoints de auth.
 */
export const PLAYSTORE_REVIEW_EMAIL = 'applicationexpense@gmail.com';
export const PLAYSTORE_REVIEW_CODE = '123456';

export function isPlayStoreReviewLogin(email: string, code: string): boolean {
    return (
        email.toLowerCase().trim() === PLAYSTORE_REVIEW_EMAIL &&
        String(code).trim() === PLAYSTORE_REVIEW_CODE
    );
}

export function isPlayStoreReviewEmail(email: string): boolean {
    return email.toLowerCase().trim() === PLAYSTORE_REVIEW_EMAIL;
}
