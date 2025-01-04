import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {Navbar} from '@/components/layout/Navbar';
import {Footer} from '@/components/layout/Footer';
import {Providers} from '@/components/Providers';
import {AuthProvider} from '@/components/AuthProvider';
import {Geist, Geist_Mono} from 'next/font/google';
import '@/styles/globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <NextIntlClientProvider messages={messages}>
            <Providers>
              <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Navbar />
                <main className="flex-grow container mx-auto px-4">
                  {children}
                </main>
                <Footer />
              </div>
            </Providers>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}