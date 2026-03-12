'use client';

import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import { useTranslation } from '../i18n/LanguageContext';

export default function TermsAndPrivacy() {
    const { t } = useTranslation();
    const { terms } = t;
    const router = useRouter();

    return (
        <div className="max-w-[800px] mx-auto px-6 pt-8 pb-16 text-text-primary md:px-8 md:pt-12 md:pb-20">
            <header className="mb-10">
                <button
                    className="inline-flex items-center gap-1.5 text-[0.9rem] text-primary bg-transparent border-none p-0 mb-6 font-medium font-[inherit] cursor-pointer hover:underline"
                    onClick={() => router.back()}
                >
                    <IoArrowBack size={16} />
                    {terms.backToLogin}
                </button>
                <h1 className="text-[1.75rem] font-bold mb-2 text-text-primary md:text-[2rem]">{terms.pageTitle}</h1>
                <p className="text-[0.85rem] text-text-secondary m-0">{terms.lastUpdated}</p>
            </header>

            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-3 text-primary">{terms.termsTitle}</h2>
                <p className="text-[0.95rem] leading-[1.7] text-text-secondary mb-6">{terms.termsIntro}</p>

                <h3 className="text-[1.1rem] font-semibold mt-8 mb-2 text-text-primary">{terms.sections.serviceTitle}</h3>
                <p className="text-[0.95rem] leading-[1.7] text-text-secondary mt-0 mb-3">{terms.sections.serviceText}</p>

                <h3 className="text-[1.1rem] font-semibold mt-8 mb-2 text-text-primary">{terms.sections.accountTitle}</h3>
                <p className="text-[0.95rem] leading-[1.7] text-text-secondary mt-0 mb-3">{terms.sections.accountText}</p>

                <h3 className="text-[1.1rem] font-semibold mt-8 mb-2 text-text-primary">{terms.sections.responsibilitiesTitle}</h3>
                <p className="text-[0.95rem] leading-[1.7] text-text-secondary mt-0 mb-3">{terms.sections.responsibilitiesText}</p>

                <h3 className="text-[1.1rem] font-semibold mt-8 mb-2 text-text-primary">{terms.sections.ipTitle}</h3>
                <p className="text-[0.95rem] leading-[1.7] text-text-secondary mt-0 mb-3">{terms.sections.ipText}</p>

                <h3 className="text-[1.1rem] font-semibold mt-8 mb-2 text-text-primary">{terms.sections.liabilityTitle}</h3>
                <p className="text-[0.95rem] leading-[1.7] text-text-secondary mt-0 mb-3">{terms.sections.liabilityText}</p>

                <h3 className="text-[1.1rem] font-semibold mt-8 mb-2 text-text-primary">{terms.sections.changesTitle}</h3>
                <p className="text-[0.95rem] leading-[1.7] text-text-secondary mt-0 mb-3">{terms.sections.changesText}</p>
            </section>

            <hr className="border-none border-t border-gray-300 my-10" />

            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-3 text-primary">{terms.privacyTitle}</h2>
                <p className="text-[0.95rem] leading-[1.7] text-text-secondary mb-6">{terms.privacyIntro}</p>

                <h3 className="text-[1.1rem] font-semibold mt-8 mb-2 text-text-primary">{terms.privacy.collectTitle}</h3>
                <p className="text-[0.95rem] leading-[1.7] text-text-secondary mt-0 mb-3">{terms.privacy.collectText}</p>
                <ul className="mt-2 mb-4 pl-5">
                    {terms.privacy.collectItems.map((item) => (
                        <li key={item} className="text-[0.95rem] leading-[1.7] text-text-secondary mb-1.5">{item}</li>
                    ))}
                </ul>

                <h3 className="text-[1.1rem] font-semibold mt-8 mb-2 text-text-primary">{terms.privacy.useTitle}</h3>
                <p className="text-[0.95rem] leading-[1.7] text-text-secondary mt-0 mb-3">{terms.privacy.useText}</p>
                <ul className="mt-2 mb-4 pl-5">
                    {terms.privacy.useItems.map((item) => (
                        <li key={item} className="text-[0.95rem] leading-[1.7] text-text-secondary mb-1.5">{item}</li>
                    ))}
                </ul>

                <h3 className="text-[1.1rem] font-semibold mt-8 mb-2 text-text-primary">{terms.privacy.storageTitle}</h3>
                <p className="text-[0.95rem] leading-[1.7] text-text-secondary mt-0 mb-3">{terms.privacy.storageText}</p>

                <h3 className="text-[1.1rem] font-semibold mt-8 mb-2 text-text-primary">{terms.privacy.cookiesTitle}</h3>
                <p className="text-[0.95rem] leading-[1.7] text-text-secondary mt-0 mb-3">{terms.privacy.cookiesText}</p>

                <h3 className="text-[1.1rem] font-semibold mt-8 mb-2 text-text-primary">{terms.privacy.rightsTitle}</h3>
                <p className="text-[0.95rem] leading-[1.7] text-text-secondary mt-0 mb-3">{terms.privacy.rightsText}</p>
                <ul className="mt-2 mb-4 pl-5">
                    {terms.privacy.rightsItems.map((item) => (
                        <li key={item} className="text-[0.95rem] leading-[1.7] text-text-secondary mb-1.5">{item}</li>
                    ))}
                </ul>
                <p className="text-[0.95rem] leading-[1.7] text-text-secondary mt-0 mb-3">{terms.privacy.rightsFooter}</p>

                <h3 className="text-[1.1rem] font-semibold mt-8 mb-2 text-text-primary">{terms.privacy.sharingTitle}</h3>
                <p className="text-[0.95rem] leading-[1.7] text-text-secondary mt-0 mb-3">{terms.privacy.sharingText}</p>

                <h3 className="text-[1.1rem] font-semibold mt-8 mb-2 text-text-primary">{terms.privacy.contactTitle}</h3>
                <p className="text-[0.95rem] leading-[1.7] text-text-secondary mt-0 mb-3">{terms.privacy.contactText}</p>
                <p className="text-[0.95rem] leading-[1.7] text-text-secondary mt-0 mb-3">
                    <a
                        className="text-primary font-medium no-underline hover:underline"
                        href={`mailto:${terms.privacy.contactEmail}`}
                    >
                        {terms.privacy.contactEmail}
                    </a>
                </p>
            </section>
        </div>
    );
}
