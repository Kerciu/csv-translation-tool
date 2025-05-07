'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ModeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const ANIMATION_DELAY = 300;
  const themes = ['light', 'dark'] as const;

  const handleClick = () => {
    setIsAnimating(true);
    const currentTheme = theme || 'light'; // Default to light if undefined
    const currentIdx = themes.indexOf(currentTheme as (typeof themes)[number]);
    const nextIdx = (currentIdx + 1) % themes.length;
    setTheme(themes[nextIdx]);
    setTimeout(() => setIsAnimating(false), ANIMATION_DELAY);
  };

  if (!mounted) {
    return (
      <Button variant='outline' size='icon' aria-label='Toggle theme'>
        <div className='size-[1.2rem]' />
      </Button>
    );
  }

  const activeTheme = resolvedTheme || theme || 'light';

  return (
    <Button variant='outline' size='icon' onClick={handleClick} aria-label='Toggle theme'>
      <div className='relative size-[1.2rem]'>
        <Sun
          className={cn(
            'absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all',
            activeTheme !== 'light' && '-rotate-90 scale-0',
            isAnimating && 'animate-pulse',
          )}
        />
        <Moon
          className={cn(
            'absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all',
            activeTheme === 'dark' && 'rotate-0 scale-100',
            isAnimating && 'animate-pulse',
          )}
        />
      </div>
    </Button>
  );
}
