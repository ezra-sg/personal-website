import ReactMarkdown from 'react-markdown';

import { useI18n } from '@/hooks/useI18n';
import AudioSnippet from '../audio/audio-snippet';

const paragraphClasses = 'font-serif mb-4 dark:text-white';

export default function SectionOne() {
    const { t } = useI18n();

    return (
        <div className="w-full bg-white dark:bg-stone-900 p-4">
            <div className="m-auto max-w-[1000px]">
                <h2 className="text-3xl font-header mb-4 dark:text-white">Part I: &quot;Guy&quot;</h2>

                <AudioSnippet src="/audio/intro.m4a" title="Ezra tests some audio" transcript="test" />

                <div className={`${paragraphClasses}`}>
                    <ReactMarkdown>
                        {t('val.section_1.paragraph_1_md')}
                    </ReactMarkdown>
                </div>

                <AudioSnippet src="/audio/test-2.m4a" title="Test #2" transcript={t('val.section_3.paragraph_3_md')} />

                <div className={`${paragraphClasses} first-letter:ml-8`}>
                    <ReactMarkdown>
                        {t('val.section_1.paragraph_2_md')}
                    </ReactMarkdown>
                </div>

                <div className={`${paragraphClasses} first-letter:ml-8`}>
                    <ReactMarkdown>
                        {t('val.section_1.paragraph_3_md')}
                    </ReactMarkdown>
                </div>

                <div className={`${paragraphClasses} first-letter:ml-8`}>
                    <ReactMarkdown>
                        {t('val.section_1.paragraph_4_md')}
                    </ReactMarkdown>
                </div>

                <div className={`${paragraphClasses} first-letter:ml-8`}>
                    <ReactMarkdown>
                        {t('val.section_1.paragraph_5_md')}
                    </ReactMarkdown>
                </div>

                <div className={`${paragraphClasses} first-letter:ml-8`}>
                    <ReactMarkdown>
                        {t('val.section_1.paragraph_6_md')}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
