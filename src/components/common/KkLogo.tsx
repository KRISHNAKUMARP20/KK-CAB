import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const KkLogo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  const sizeClasses = {
    sm: { svg: 'w-8 h-8', text: 'text-sm' },
    md: { svg: 'w-12 h-12', text: 'text-base sm:text-lg' },
    lg: { svg: 'w-16 h-16', text: 'text-xl sm:text-2xl' },
    xl: { svg: 'w-20 h-20', text: 'text-3xl' },
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses.svg} relative group shrink-0`}>
        {/* Neon glow behind hex shield */}
        <div className="absolute inset-0 bg-cyan-500/20 rounded-3xl blur-md group-hover:bg-cyan-500/35 transition duration-500"></div>
        
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full relative z-10 filter drop-shadow-[0_2px_8px_rgba(6,182,212,0.35)]"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hexagonal Shield outer border */}
          <polygon 
            points="50,5 90,25 90,75 50,95 10,75 10,25" 
            className="stroke-[3] stroke-slate-800 fill-slate-950"
          />
          {/* Inner neon guide line */}
          <polygon 
            points="50,9 86,27 86,73 50,91 14,73 14,27" 
            className="stroke-[1.5] stroke-cyan-500/30"
          />
          
          {/* Glowing futuristic car body path */}
          <path 
            d="M32 46 C32 46, 42 33, 50 33 C58 33, 68 46, 68 46 L78 46 C82 46, 85 49, 85 53 L81 61 C80 63, 77 65, 74 65 L26 65 C23 65, 20 63, 19 61 L15 53 C15 49, 18 46, 22 46 Z" 
            className="stroke-[3] stroke-cyan-400 fill-cyan-950/40"
            strokeLinejoin="round"
            fill="url(#body-grad)"
          />
          
          {/* Windshield / Window */}
          <path 
            d="M38 46 C38 46, 44 37, 50 37 C56 37, 62 46, 62 46 Z" 
            className="stroke-[1.5] stroke-cyan-300 fill-cyan-400/20"
          />

          {/* Glowing wheels */}
          <circle cx="34" cy="65" r="7" className="fill-slate-950 stroke-[2] stroke-cyan-300" />
          <circle cx="66" cy="65" r="7" className="fill-slate-950 stroke-[2] stroke-cyan-300" />
          <circle cx="34" cy="65" r="2.5" className="fill-cyan-400" />
          <circle cx="66" cy="65" r="2.5" className="fill-cyan-400" />

          {/* Sleek Underglow line */}
          <line x1="25" y1="76" x2="75" y2="76" className="stroke-[2] stroke-cyan-500/60" strokeLinecap="round" />
          
          {/* Integrated 'KK' monogram overlay in the shield center */}
          <path 
            d="M45 44 L45 54 M45 49 L50 44 M45 49 L50 54" 
            className="stroke-[2] stroke-teal-300/80"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path 
            d="M51 44 L51 54 M51 49 L56 44 M51 49 L56 54" 
            className="stroke-[2] stroke-cyan-300/80"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <defs>
            <linearGradient id="body-grad" x1="15" y1="46" x2="85" y2="65" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col text-left">
          <h1 className={`font-heading font-black tracking-tight text-white ${sizeClasses.text} leading-none flex items-center`}>
            KK <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent ml-1.5 font-bold">SMART</span> CAB
          </h1>
          <span className="text-[9px] uppercase font-bold tracking-widest text-cyan-500/60 font-mono leading-none mt-1.5">
            Smart Mobility Solutions
          </span>
        </div>
      )}
    </div>
  );
};
