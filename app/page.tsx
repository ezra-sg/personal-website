import Link from 'next/link';

import type { Metadata } from 'next';

import { MdEmail } from 'react-icons/md';
import { BsGithub, BsLinkedin } from 'react-icons/bs';

export const metadata: Metadata = {
    metadataBase: new URL('https://ezra-sg.com/'),
    title: 'Ezra Sowden-Guzman\'s personal website',
    description: 'Ezra Sowden-Guzman\'s personal website',
    openGraph: {
        title: 'Ezra Sowden-Guzman\'s personal website',
    },
    keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Ezra', 'Sowden-Guzman', 'Portfolio', 'Frontend'],
    authors: [{ name: 'Ezra Sowden-Guzman', url: 'https://ezra-sg.com' }],
    creator: 'Ezra Sowden-Guzman',
    alternates: {
        canonical: '/',
    },
};

export default function Home() {
    return (
        <main className="min-h-screen bg-[#e5e5e5] text-[#2d2d2d] dark:bg-[#2d2d2d] dark:text-white">
            <div className="max-w-[800px] mx-auto px-6 py-12 md:py-16">
                <section className="mb-12">
                    <p className="text-lg leading-relaxed mb-4">
                        Hi! I&apos;m Ezra. I&apos;m a Philadelphia-based technologist who&apos;s been tinkering, building, breaking, 
                        and creating with computers since childhood. I am currently a Senior Software Engineer at{' '}
                        <Link href="https://tucows.com" className="underline hover:no-underline">
                            Tucows
                        </Link>, helping to build and maintain the infrastructure that keeps the internet working.
                    </p>
                    <p className="text-lg leading-relaxed mb-4">
                        My experience lies mostly in the frontend space, where I spend my time making it easy and enjoyable 
                        for users to interact with complex concepts, and enabling my team to turn their intentions into concrete 
                        data and changes in our systems. I care deeply about doing things the right way, from having high standards 
                        for code quality to treating my teammates with the dignity and respect they deserve. I make use of AI in my 
                        workflow now, and I treat it as an eager junior engineer who has a lot of knowledge, but very little experience 
                        in the real world (and who can type blisteringly fast). My relationship with AI is evolving every day, and I am 
                        really [cautiously] excited to see how the job of software engineering evolves because of it.
                    </p>
                    <p className="text-lg leading-relaxed">
                        In my free time, I spend time with my fiancé and cats and friends, read, game, play guitar, and tinker with 
                        all things tech. I am currently spending much of my time outside of work developing an open source game engine 
                        for interactive fiction games with built in NLP capabilities; you can check it out at{' '}
                        <Link href="https://allegoryjs.com" className="underline hover:no-underline">
                            https://allegoryjs.com
                        </Link>
                    </p>
                </section>

                <section className="mb-12 border-t-2 border-current pt-8">
                    <h2 className="text-2xl font-bold mb-4">Contact</h2>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-3">
                            <MdEmail className="text-xl" />
                            <Link href="mailto:esowdenguzman@pm.me" className="underline hover:no-underline">
                                esowdenguzman@pm.me
                            </Link>
                        </li>
                        <li className="flex items-center gap-3">
                            <BsLinkedin className="text-xl" />
                            <Link href="https://www.linkedin.com/in/Ezra-sg" className="underline hover:no-underline">
                                linkedin.com/in/Ezra-sg
                            </Link>
                        </li>
                        <li className="flex items-center gap-3">
                            <BsGithub className="text-xl" />
                            <Link href="https://github.com/ezra-sg" className="underline hover:no-underline">
                                github.com/ezra-sg
                            </Link>
                        </li>
                    </ul>
                </section>

                <section className="border-t-2 border-current pt-8">
                    <h2 className="text-2xl font-bold mb-4">Projects</h2>
                    <ul className="space-y-6">
                        <li>
                            <Link href="https://allegoryjs.com" className="text-xl underline hover:no-underline font-bold">
                                allegory.js
                            </Link>
                            <p className="mt-1">An open source web based interactive fiction game engine</p>
                        </li>
                        <li>
                            <Link href="/val/en" className="text-xl underline hover:no-underline font-bold">
                                Val
                            </Link>
                            <p className="mt-1">A website dedicated to my father</p>
                        </li>
                        <li>
                            <span className="text-xl font-bold text-[#808080] dark:text-[#999999]">
                                Kim
                            </span>
                            <span className="ml-2 text-sm">(coming soon)</span>
                            <p className="mt-1">A website dedicated to my mother</p>
                        </li>
                    </ul>
                </section>
            </div>
        </main>
    );
}
