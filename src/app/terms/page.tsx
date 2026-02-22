'use client';

import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import { useTranslation } from '../i18n/LanguageContext';
import * as S from './styles';

export default function TermsAndPrivacy() {
    const { t } = useTranslation();
    const { terms } = t;
    const router = useRouter();

    return (
        <S.Container>
            <S.Header>
                <S.BackButton onClick={() => router.back()}>
                    <IoArrowBack size={16} />
                    {terms.backToLogin}
                </S.BackButton>
                <S.PageTitle>{terms.pageTitle}</S.PageTitle>
                <S.LastUpdated>{terms.lastUpdated}</S.LastUpdated>
            </S.Header>

            <S.SectionGroup>
                <S.SectionTitle>{terms.termsTitle}</S.SectionTitle>
                <S.SectionIntro>{terms.termsIntro}</S.SectionIntro>

                <S.ArticleTitle>{terms.sections.serviceTitle}</S.ArticleTitle>
                <S.Paragraph>{terms.sections.serviceText}</S.Paragraph>

                <S.ArticleTitle>{terms.sections.accountTitle}</S.ArticleTitle>
                <S.Paragraph>{terms.sections.accountText}</S.Paragraph>

                <S.ArticleTitle>{terms.sections.responsibilitiesTitle}</S.ArticleTitle>
                <S.Paragraph>{terms.sections.responsibilitiesText}</S.Paragraph>

                <S.ArticleTitle>{terms.sections.ipTitle}</S.ArticleTitle>
                <S.Paragraph>{terms.sections.ipText}</S.Paragraph>

                <S.ArticleTitle>{terms.sections.liabilityTitle}</S.ArticleTitle>
                <S.Paragraph>{terms.sections.liabilityText}</S.Paragraph>

                <S.ArticleTitle>{terms.sections.changesTitle}</S.ArticleTitle>
                <S.Paragraph>{terms.sections.changesText}</S.Paragraph>
            </S.SectionGroup>

            <S.Divider />

            <S.SectionGroup>
                <S.SectionTitle>{terms.privacyTitle}</S.SectionTitle>
                <S.SectionIntro>{terms.privacyIntro}</S.SectionIntro>

                <S.ArticleTitle>{terms.privacy.collectTitle}</S.ArticleTitle>
                <S.Paragraph>{terms.privacy.collectText}</S.Paragraph>
                <S.List>
                    {terms.privacy.collectItems.map((item) => (
                        <S.ListItem key={item}>{item}</S.ListItem>
                    ))}
                </S.List>

                <S.ArticleTitle>{terms.privacy.useTitle}</S.ArticleTitle>
                <S.Paragraph>{terms.privacy.useText}</S.Paragraph>
                <S.List>
                    {terms.privacy.useItems.map((item) => (
                        <S.ListItem key={item}>{item}</S.ListItem>
                    ))}
                </S.List>

                <S.ArticleTitle>{terms.privacy.storageTitle}</S.ArticleTitle>
                <S.Paragraph>{terms.privacy.storageText}</S.Paragraph>

                <S.ArticleTitle>{terms.privacy.cookiesTitle}</S.ArticleTitle>
                <S.Paragraph>{terms.privacy.cookiesText}</S.Paragraph>

                <S.ArticleTitle>{terms.privacy.rightsTitle}</S.ArticleTitle>
                <S.Paragraph>{terms.privacy.rightsText}</S.Paragraph>
                <S.List>
                    {terms.privacy.rightsItems.map((item) => (
                        <S.ListItem key={item}>{item}</S.ListItem>
                    ))}
                </S.List>
                <S.Paragraph>{terms.privacy.rightsFooter}</S.Paragraph>

                <S.ArticleTitle>{terms.privacy.sharingTitle}</S.ArticleTitle>
                <S.Paragraph>{terms.privacy.sharingText}</S.Paragraph>

                <S.ArticleTitle>{terms.privacy.contactTitle}</S.ArticleTitle>
                <S.Paragraph>{terms.privacy.contactText}</S.Paragraph>
                <S.Paragraph>
                    <S.EmailLink href={`mailto:${terms.privacy.contactEmail}`}>
                        {terms.privacy.contactEmail}
                    </S.EmailLink>
                </S.Paragraph>
            </S.SectionGroup>
        </S.Container>
    );
}
