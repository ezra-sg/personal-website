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
        <main className="min-h-screen bg-[#e5e5e5] text-[#2d2d2d] dark:bg-[#2d2d2d] dark:text-white font-mono">
            <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16">
                {/* Desktop: Bio left, Contact+Projects stacked in right sidebar */}
                {/* Mobile: Contact, hr, Bio, hr, Projects */}
                <div className="flex flex-col md:flex-row md:gap-8">
                    {/* Contact Section - Shows first on mobile, in desktop right sidebar (top) */}
                    <section className="md:hidden mb-0">
                        <h2 className="text-2xl font-bold mb-4">Contact</h2>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-3">
                                <MdEmail className="text-xl" />
                                <Link href="mailto:hello@ezra-sg.com" className="underline hover:no-underline">
                                    hello@ezra-sg.com
                                </Link>
                            </li>
                            <li className="flex items-center gap-3">
                                <BsLinkedin className="text-xl" />
                                <Link href="https://www.linkedin.com/in/ezra-sg" className="underline hover:no-underline">
                                    linkedin.com/in/ezra-sg
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

                    {/* Horizontal rule after Contact on mobile only */}
                    <hr className="border-t-2 border-current my-8 md:hidden" />

                    {/* Main Content - Bio - Shows after Contact on mobile, left side on desktop */}
                    <div className="md:order-1 md:flex-1">
                        <section>
                            <p className="text-lg leading-relaxed mb-4">
                                Hi! I&apos;m Ezra. I&apos;m a Philadelphia-based technologist who&apos;s been tinkering, building, breaking,
                                and creating with computers since childhood. I am currently a Senior Software Engineer at{' '}
                                <Link href="https://tucows.com" className="underline hover:no-underline">
                                    Tucows
                                </Link>, helping to build and maintain the infrastructure that keeps the internet working.
                            </p>
                            <p className="text-lg leading-relaxed mb-4">
                                My experience lies mostly in the frontend space, where I spend my time making it easy and enjoyable
                                for users to interact with complex concepts, and enabling my team to turn user intentions into concrete
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
                    </div>

                    {/* Horizontal rule before Projects on mobile only */}
                    <hr className="border-t-2 border-current my-8 md:hidden" />

                    {/* Projects Section - Shows last on mobile, hidden on desktop (shown in aside below) */}
                    <section className="md:hidden">
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
                                <span className="ml-2 text-sm">(work in progress)</span>
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

                    {/* Desktop Right Sidebar - Contact and Projects stacked */}
                    <aside className="hidden md:block md:order-2 md:w-[300px] md:flex-shrink-0">
                        {/* Contact Section */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Contact</h2>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-3">
                                    <MdEmail className="text-xl" />
                                    <Link href="mailto:hello@ezra-sg.com" className="underline hover:no-underline">
                                        hello@ezra-sg.com
                                    </Link>
                                </li>
                                <li className="flex items-center gap-3">
                                    <BsLinkedin className="text-xl" />
                                    <Link href="https://www.linkedin.com/in/ezra-sg" className="underline hover:no-underline">
                                        linkedin.com/in/ezra-sg
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

                        {/* Projects Section */}
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
                                    <span className="ml-2 text-sm">(work in progress)</span>
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
                    </aside>
                </div>
            </div>
        </main>
    );
}
