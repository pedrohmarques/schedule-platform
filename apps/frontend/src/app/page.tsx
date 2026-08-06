export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col items-center gap-4 px-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Schedule Platform
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Frontend em Next.js pronto para consumir a API em{' '}
          <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
            src/lib/api.ts
          </code>
          .
        </p>
      </main>
    </div>
  );
}
