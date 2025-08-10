import { GameContainer } from '@/components/game-container';

export default function Home() {
  return (
    <main className="container mx-auto p-4 flex flex-col h-screen max-h-screen">
      <header className="text-center py-4 flex-shrink-0">
        <h1 className="text-4xl font-headline text-primary" style={{ textShadow: '1px 1px 2px hsl(var(--primary) / 0.2)' }}>
          ScribeScroll Adventures
        </h1>
      </header>
      <GameContainer />
    </main>
  );
}
