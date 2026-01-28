import Script from 'next/script';

import './globals.css';

export default function RootLayout({
    children,
}: {
  children: React.ReactNode
}) {
    return (
        <html lang="en">
            <Script data-goatcounter="https://ezra-sg.goatcounter.com/count" strategy="lazyOnload" src="//gc.zgo.at/count.js" />

            <body className="font-mono">{children}</body>
        </html>
    );
}
