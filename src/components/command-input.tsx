'use client';

import { useState, useRef, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, Hand, Wand2, BookOpen, Send, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface CommandInputProps {
  onCommandSubmit: (command: string) => void;
  isProcessing: boolean;
}

const standardCommands = [
    { name: 'North', icon: ArrowUp, example: 'go north' },
    { name: 'South', icon: ArrowDown, example: 'go south' },
    { name: 'West', icon: ArrowLeft, example: 'go west' },
    { name: 'East', icon: ArrowRight, example: 'go east' },
    { name: 'Look', icon: Eye, example: 'look at the room' },
    { name: 'Take', icon: Hand, example: 'take the tome' },
    { name: 'Use', icon: Wand2, example: 'use tome on door' },
    { name: 'Read', icon: BookOpen, example: 'read the tome' },
  ];

export function CommandInput({ onCommandSubmit, isProcessing }: CommandInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onCommandSubmit(inputValue);
    setInputValue('');
  };

  const handleStandardCommand = (command: string) => {
    onCommandSubmit(command.toLowerCase());
  };

  return (
    <div className="flex-shrink-0 pb-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {standardCommands.map(({ name, icon: Icon, example }) => (
          <Button
            key={name}
            variant="outline"
            size="sm"
            className="border-primary/30 hover:bg-primary/10"
            onClick={() => handleStandardCommand(name)}
            title={example}
            disabled={isProcessing}
          >
            <Icon className="mr-2 h-4 w-4" />
            {name}
          </Button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What do you do?"
          disabled={isProcessing}
          className="bg-background/80 focus-visible:ring-primary"
          aria-label="Command Input"
        />
        <Button type="submit" disabled={isProcessing} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {isProcessing ? 'Thinking...' : <Send className="h-4 w-4" />}
          <span className="sr-only">Submit Command</span>
        </Button>
      </form>
    </div>
  );
}
