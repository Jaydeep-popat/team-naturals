import React from 'react';

export function SectionHeading({ children, className = '', id }: { children: string, className?: string, id?: string }) {
  // Normalize \n to be its own token so we can easily map over it
  const normalized = children.replace(/\n/g, ' \n ');
  const tokens = normalized.split(' ').filter(t => t !== '');
  
  const wordTokens = tokens.filter(t => t !== '\n');
  let wordIndex = 0;

  return (
    <h2 id={id} className={`font-sans text-[44px] font-extrabold leading-[1.05] tracking-tight text-forest-deep sm:text-6xl md:text-7xl ${className}`}>
      {tokens.map((token, i) => {
        if (token === '\n') {
          return <br key={i} />;
        }

        const isGreen = wordIndex % 2 === 0;
        const isLastOfThree = wordTokens.length === 3 && wordIndex === 2;
        
        wordIndex++;
        
        return (
          <React.Fragment key={i}>
            {isLastOfThree && <br className="hidden sm:block" />}
            <span className={isGreen ? 'text-forest-soft' : 'text-forest'}>
              {token}{' '}
            </span>
          </React.Fragment>
        );
      })}
    </h2>
  );
}
