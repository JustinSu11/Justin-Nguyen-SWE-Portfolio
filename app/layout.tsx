import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Justin Nguyen — Software engineer',
  description: 'Full-stack and applied-AI engineer in San Diego. Marine Corps veteran. Selected work, stack and contact.',
};

const fonts =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&family=Noto+Serif:ital@1&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href={fonts} />
      </head>
      <body data-v="weave">{children}</body>
    </html>
  );
}
