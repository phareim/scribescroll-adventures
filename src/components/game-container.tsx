'use client';

import { useState, useCallback } from 'react';
import { StoryDisplay } from '@/components/story-display';
import { CommandInput } from '@/components/command-input';
import { handleCommand } from '@/app/actions';

export type StoryEntry = {
  id: number;
  type: 'user' | 'game' | 'system';
  text: string;
};

export function GameContainer() {
  const [storyLog, setStoryLog] = useState<StoryEntry[]>([
    { id: 1, type: 'system', text: 'Welcome to ScribeScroll Adventures! A vast world awaits. What will you do first?' },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const submitCommand = useCallback(async (command: string) => {
    if (!command.trim() || isProcessing) return;

    setIsProcessing(true);
    const userEntryId = Date.now();
    setStoryLog(prev => [...prev, { id: userEntryId, type: 'user', text: `> ${command}` }]);

    const gameResponse = await handleCommand(command);
    const gameEntryId = Date.now() + 1; // ensure uniqueness

    setStoryLog(prev => [...prev, { id: gameEntryId, type: 'game', text: gameResponse }]);
    setIsProcessing(false);
  }, [isProcessing]);

  return (
    <div className="flex flex-col flex-grow min-h-0">
      <StoryDisplay storyLog={storyLog} />
      <CommandInput onCommandSubmit={submitCommand} isProcessing={isProcessing} />
    </div>
  );
}
