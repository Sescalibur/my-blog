
declare module 'next' {
  interface PageProps {
    params: {
      locale: string
      slug?: string
      id?: string
    }
    searchParams?: { [key: string]: string | string[] | undefined }
  }
} 