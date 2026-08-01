import React from 'react';

export function SectionHeading({ children, className = '', id }: { children: string, className?: string, id?: string }) {
  const words = children.split(' ');
  
  return (
    <h2 id={id} className={`font-sans text-[44px] font-extrabold leading-[1.05] tracking-tight text-forest-deep sm:text-6xl md:text-7xl ${className}`}>
      {words.map((word, i) => {
        const isGreen = i % 2 === 0;
        const isLastOfThree = words.length === 3 && i === 2;
        
        return (
          <React.Fragment key={i}>
            {isLastOfThree && <br className="hidden sm:block" />}
            <span className={isGreen ? 'text-forest-soft' : 'text-forest'}>
              {word}{' '}
            </span>
          </React.Fragment>
        );
      })}
    </h2>
  );
}
