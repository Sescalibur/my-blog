import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const locales = ['en', 'tr', 'es', 'de'] as const;
export type Locale = (typeof locales)[number];

export const pathnames = {
  '/': '/',
  '/blog': '/blog',
  '/blog/[slug]': '/blog/[slug]',
  '/about': '/about',
  '/auth/signin': '/auth/signin',
  '/auth/signup': '/auth/signup',
  '/auth/forgot-password': '/auth/forgot-password',
  '/auth/reset-password': '/auth/reset-password',
} as const;

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  pathnames
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);