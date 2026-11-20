import { useState } from 'react';
import { Camera } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

export function ResilientImage({ src, alt, title, className = '' }: ResilientImageProps) {
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

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
