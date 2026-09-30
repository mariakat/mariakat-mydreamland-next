import Image from "next/image";
import { mediaUrl, type SiteSettings } from "@/lib/strapi";

// The author's photo from "Ρυθμίσεις site", or the mascot until one is set.
export function AuthorAvatar({
  settings,
  size,
}: {
  settings: SiteSettings;
  size: number;
}) {
  const photo = mediaUrl(settings.authorPhoto);
  return (
    <div
      className="flex shrink-0 items-end justify-center overflow-hidden rounded-full bg-blush"
      style={{ width: size, height: size }}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" className="block h-full w-full object-cover" />
      ) : (
        <Image
          src="/images/mascot.png"
          alt=""
          width={547}
          height={462}
          className="h-auto w-[150%] max-w-none translate-y-[6%]"
        />
      )}
    </div>
  );
}
