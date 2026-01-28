import { Suspense } from 'react';
import Link from 'next/link';

import type { Metadata } from 'next';

import { MdEmail } from 'react-icons/md';
import { BsGithub, BsLinkedin, BsFillFileEarmarkPdfFill } from 'react-icons/bs';

import Starfield from '@/components/starfield/starfield';


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
    return (<>
        <Suspense fallback={<div className="fixed top-0 right-0 bottom-0 left-0 z-0 bg-black"></div>}>
            <Starfield />
        </Suspense>

        <div className="absolute top-0 right-0 bottom-0 left-0 p-8 m-auto w-max h-max max-w-[90svw] max-h-[75svh] overflow-auto bg-white/90 rounded-md lg:max-w-[1000px] dark:bg-stone-900/90 dark:text-white">
            <div className="flex items-center justify-center gap-2 mb-4">
                🛠️ This site is under construction 🛠️
            </div>

            <p className="mb-6">
                👋 Welcome to my website! My name is <strong>Ezra Sowden-Guzman</strong>, and I&apos;m a frontend engineer. There isn&apos;t much to see here just yet.
                This page will soon contain information about me and my projects. For now, feel free to view the work which is in progress
                (currently working on the page dedicated to my father). I am working on this site daily, so check back soon!
                You can view the source code for this website&nbsp;
                <Link href="https://github.com/ezra-sg/portfolio" className="text-blue-500 hover:underline">
                    here
                </Link>.
            </p>

            <h2>
                My info:
            </h2>
            <ul className="mb-6">
                <li className="flex items-center gap-2">
                    <MdEmail />
                    <Link href="mailto:esowdenguzman@gmail.com" className="text-blue-500 hover:underline">
                        esowdenguzman@gmail.com
                    </Link>
                </li>
                <li className="flex items-center gap-2">
                    <BsLinkedin />
                    <Link href="https://www.linkedin.com/in/ezra-sg" className="text-blue-500 hover:underline">
                        www.linkedin.com/in/ezra-sg
                    </Link>
                </li>
                <li className="flex items-center gap-2">
                    <BsGithub />
                    <Link href="https://www.github.com/ezra-sg" className="text-blue-500 hover:underline">
                        www.github.com/ezra-sg
                    </Link>
                </li>
                <li className="flex items-center gap-2">
                    <BsFillFileEarmarkPdfFill />
                    <a href="/documents/resume--january-2024.pdf" download className="text-blue-500 hover:underline">
                        Resume (PDF)
                    </a>
                </li>
            </ul>

            <h2 className="mb-2">
                Projects:
            </h2>
            <ul className="list-disc ml-4 mb-6">
                <li>
                    <Link href="https://allegoryjs.com" className="text-blue-500 hover:underline">
                        allegory.js
                    </Link>
                    <br/>
                    - an open source interactive fiction game engine built for the web, with local natural language processing baked in
                </li>
            </ul>

            <p>Below you can get a sneak peek of what&apos;s to come:</p>

            <ul className="list-disc ml-4">
                <li>
                    <Link href="/val/en" className="text-blue-500 hover:underline">
                        Dad <em>(under construction)</em>
                    </Link>
                    <br/>
                    - a webpage dedicated to my father. Comprises an interview with him, a photo gallery, and a timeline of his life.
                </li>
                <li>
                    Mom <em>(coming soon)</em>
                    <br/>
                    - a webpage dedicated to my mother. Comprises an interview with her, a photo gallery, and a timeline of her life.
                </li>
                <li>
                    About me <em>(coming soon)</em>
                    <br/>
                    - a section of this page will be dedicated to showing information about me
                </li>
                <li>
                    Work experience <em>(coming soon)</em>
                    <br/>
                    - a section of this page will be dedicated to showing my work experience
                </li>
                <li>
                    <code>/uses</code> <em>(coming soon)</em>
                    <br/>
                    - a page dedicated to showing the tools I use to do my work
                </li>
            </ul>
        </div>
    </>);
}
