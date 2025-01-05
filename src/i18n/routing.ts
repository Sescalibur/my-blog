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
  '/profile': '/profile',
  '/blog/new': '/blog/new',
  '/blog/edit/[slug]': '/blog/edit/[slug]',
  '/blog/delete/[slug]': '/blog/delete/[slug]',
  '/blog/drafts': '/blog/drafts',
  '/blog/drafts/[slug]': '/blog/drafts/[slug]',
  '/blog/drafts/new': '/blog/drafts/new',
  '/blog/drafts/edit/[slug]': '/blog/drafts/edit/[slug]',
  '/blog/drafts/delete/[slug]': '/blog/drafts/delete/[slug]'
} as const;

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  pathnames
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);