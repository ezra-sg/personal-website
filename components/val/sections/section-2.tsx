import ReactMarkdown from 'react-markdown';

import { useI18n } from '@/hooks/useI18n';

const paragraphClasses = 'font-serif mb-4 dark:text-white';

export default function SectionTwo() {
    const { t } = useI18n();

    return (
        <div className="w-full bg-white dark:bg-stone-900 p-4">
            <div className="m-auto max-w-[1000px]">
                <h2 className="text-3xl font-header mb-4 dark:text-white">Part II: Engineer</h2>

                <div className={`${paragraphClasses}`}>
                    <ReactMarkdown>
                        {t('val.section_2.paragraph_1_md')}
                    </ReactMarkdown>
                </div>

                <div className={`${paragraphClasses} first-letter:ml-8`}>
                    <ReactMarkdown>
                        {t('val.section_2.paragraph_2_md')}
                    </ReactMarkdown>
                </div>

                <div className={`${paragraphClasses} first-letter:ml-8`}>
                    <ReactMarkdown>
                        {t('val.section_2.paragraph_3_md')}
                    </ReactMarkdown>
                </div>

                <div className={`${paragraphClasses} first-letter:ml-8`}>
                    <ReactMarkdown>
                        {t('val.section_2.paragraph_4_md')}
                    </ReactMarkdown>
                </div>

                <div className={`${paragraphClasses} first-letter:ml-8`}>
                    <ReactMarkdown>
                        {t('val.section_2.paragraph_5_md')}
                    </ReactMarkdown>
                </div>

                <div className={`${paragraphClasses} first-letter:ml-8`}>
                    <ReactMarkdown>
                        {t('val.section_2.paragraph_6_md')}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
