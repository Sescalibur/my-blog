import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

// Middleware'i oluştur
const intlMiddleware = createMiddleware(routing);

// Kendi middleware'imizi oluştur
export default async function middleware(request: Request) {
  const pathname = new URL(request.url).pathname;

  // Auth callback'leri için bypass
  if (pathname.startsWith('/api/auth') || 
      pathname.startsWith('/_next') || 
      pathname.includes('.')) {
    return;
  }

  // Eğer pathname bir locale ile başlamıyorsa
  const pathnameHasLocale = routing.locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // URL'i oluştur
    const newUrl = new URL(request.url);
    // Varsayılan locale'i ekle (tr)
    newUrl.pathname = `/tr${pathname}`;
    // 307 ile yönlendir
    return Response.redirect(newUrl);
  }

  // Normal intl middleware'i çalıştır
  return intlMiddleware(request);
}

export const config = {
  // Matcher'ı güncelle
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};