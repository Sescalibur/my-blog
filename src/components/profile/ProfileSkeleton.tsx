import { Skeleton } from '../ui/Skeleton'

export function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      {/* Kapak Fotoğrafı Skeleton */}
      <div className="relative h-[200px] md:h-[300px] -mx-4">
        <Skeleton className="absolute inset-0" />
      </div>

      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Sol Taraf - Profil Bilgileri */}
          <div className="space-y-6">
            {/* Avatar Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>

            {/* İsim Alanı Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Bio Alanı Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-32 w-full" />
            </div>

            {/* Sosyal Medya Linkleri Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>

          {/* Sağ Taraf - Blog Yazıları */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 