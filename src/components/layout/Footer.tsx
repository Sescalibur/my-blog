import {useTranslations} from 'next-intl';
  
export function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer className="py-6 border-t">
      <div className="container mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} {t('main')}</p>
      </div>
    </footer>
  )
} 