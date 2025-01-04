import {useTranslations} from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold mb-4">
        {t('title')}
      </h1>
      <p className="text-lg text-muted-foreground">
        {t('description')}
      </p>
    </div>
  );
}