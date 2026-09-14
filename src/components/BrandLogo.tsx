import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'image' | 'full';
  showSubtext?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showSubtext = true,
}) => {
  const [imgError, setImgError] = useState(false);

  // Dimension presets
  const sizeMap = {
    sm: { img: 'h-9 w-9', text: 'text-base', sub: 'text-[9px]' },
    md: { img: 'h-11 w-11', text: 'text-lg', sub: 'text-[10px]' },
    lg: { img: 'h-16 w-16', text: 'text-2xl', sub: 'text-xs' },
    xl: { img: 'h-24 w-24', text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official Brand Logo Icon */}
      {!imgError ? (
        <div className="relative shrink-0 overflow-hidden rounded-lg bg-black border border-[#C5A059]/40 p-0.5">
          <img
            src="/logo.jpg"
            alt="Cristopher BarberShop Logo"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className={`${currentSize.img} object-contain rounded filter contrast-125`}
          />
        </div>
      ) : (
        /* Fallback Vector Razor Monogram */
        <div className={`${currentSize.img} rounded-lg bg-black border border-[#C5A059]/50 flex items-center justify-center p-1.5 shrink-0`}>
          <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
            {/* Razor blade & handle */}
            <path d="M75,20 L85,35 L45,75 L35,60 Z" fill="#F4F4F5" />
            <path d="M40,65 L20,85 L15,80 L35,60 Z" fill="#C5A059" />
            <circle cx="37" cy="62" r="3" fill="#0B0B0C" />
          </svg>
        </div>
      )}

      {/* Typography with Cursive 'Cristopher' and '— BARBERSHOP —' */}
      <div className="flex flex-col justify-center">
        <span
          className={`font-serif tracking-normal text-white leading-none font-bold italic ${currentSize.text}`}
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Cristopher
        </span>
        {showSubtext && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="h-[1px] w-2 bg-[#C5A059]" />
            <span
              className={`font-sans tracking-[0.25em] text-[#C5A059] uppercase font-bold ${currentSize.sub}`}
            >
              Barbershop
            </span>
            <span className="h-[1px] w-2 bg-[#C5A059]" />
          </div>
        )}
      </div>
    </div>
  );
};
