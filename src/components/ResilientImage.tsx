import { useState } from 'react';
import { Camera } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
}

const RESPONSIVE_WEBP_MAP: Record<
  string,
  { srcSet: string; fallbackWebp: string; width: number; height: number }
> = {
  '/assets/aistudio/image_2dfd57c7.png': {
    srcSet: '/assets/aistudio/image_2dfd57c7-640.webp 640w, /assets/aistudio/image_2dfd57c7.webp 960w',
    fallbackWebp: '/assets/aistudio/image_2dfd57c7.webp',
    width: 960,
    height: 1050,
  },
  '/assets/aistudio/image_e65c65a0.png': {
    srcSet: '/assets/aistudio/image_e65c65a0-640.webp 640w, /assets/aistudio/image_e65c65a0.webp 960w',
    fallbackWebp: '/assets/aistudio/image_e65c65a0.webp',
    width: 960,
    height: 1050,
  },
  '/assets/aistudio/image_9cbec800.png': {
    srcSet: '/assets/aistudio/image_9cbec800.webp 537w',
    fallbackWebp: '/assets/aistudio/image_9cbec800.webp',
    width: 537,
    height: 404,
  },
  '/assets/aistudio/image_cf826403.png': {
    srcSet: '/assets/aistudio/image_cf826403.webp 312w',
    fallbackWebp: '/assets/aistudio/image_cf826403.webp',
    width: 312,
    height: 210,
  },
  '/assets/aistudio/image_556451e3.png': {
    srcSet: '/assets/aistudio/image_556451e3.webp 128w',
    fallbackWebp: '/assets/aistudio/image_556451e3.webp',
    width: 128,
    height: 128,
  },
};

export function ResilientImage({
  src,
  alt,
  title,
  className = '',
  priority = false,
  sizes = '(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 640px',
  width,
  height,
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#111114] via-[#0A0A0C] to-[#050505] text-zinc-400 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Camera className="w-7 h-7 text-zinc-500 mb-3 stroke-[1.25]" />
        {title && <p className="font-display text-lg text-zinc-200 max-w-xs">{title}</p>}
      </div>
    );
  }

  const normalized = src.split('?')[0];
  const webpEntry = RESPONSIVE_WEBP_MAP[normalized];
  const imgWidth = width ?? webpEntry?.width;
  const imgHeight = height ?? webpEntry?.height;

  if (webpEntry) {
    return (
      <picture className="contents">
        <source type="image/webp" srcSet={webpEntry.srcSet} sizes={sizes} />
        <img
          src={webpEntry.fallbackWebp}
          alt={alt}
          width={imgWidth}
          height={imgHeight}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className={className}
        />
      </picture>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={imgWidth}
      height={imgHeight}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
