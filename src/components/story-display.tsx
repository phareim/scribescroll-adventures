'use client';

import { useEffect, useRef } from 'react';
import type { StoryEntry } from './game-container';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StoryDisplayProps {
  storyLog: StoryEntry[];
}

export function StoryDisplay({ storyLog }: StoryDisplayProps) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [storyLog]);

  return (
    <Card className="flex-grow flex flex-col min-h-0 mb-4 border-primary/20 shadow-lg bg-background/80">
      <CardContent className="p-4 flex-grow min-h-0 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {storyLog.map((entry) => (
            <p
              key={entry.id}
              className={cn(
                'text-base leading-relaxed animate-in fade-in duration-700',
                entry.type === 'user' && 'text-primary font-semibold',
                entry.type === 'system' && 'text-accent italic',
                entry.type === 'game' && 'text-foreground'
              )}
            >
              {entry.text}
            </p>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
      </CardContent>
    </Card>
  );
}
