export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-stretch justify-center px-4 py-6 md:px-6 md:py-8">
      <div className="flex w-full max-w-6xl gap-5 md:gap-6">
        <div className="glass-panel flex h-full w-full max-w-[240px] flex-col justify-between rounded-3xl border border-slate-800/80 p-4">
          <div className="space-y-4">
            <div className="h-9 w-32 animate-pulse rounded-2xl bg-slate-800/80" />
            <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-900/80" />
          </div>
          <div className="space-y-3">
            <div className="h-9 w-full animate-pulse rounded-full bg-slate-900/80" />
            <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-900/80" />
          </div>
        </div>

        <main className="flex min-h-full flex-1 flex-col gap-4 rounded-3xl border border-slate-800/80 bg-slate-950/60 p-4 shadow-2xl shadow-black/50 backdrop-blur-2xl md:p-6">
          <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="h-3 w-32 animate-pulse rounded-full bg-slate-800/80" />
              <div className="h-3 w-48 animate-pulse rounded-full bg-slate-900/80" />
            </div>
            <div className="h-8 w-48 animate-pulse rounded-full bg-slate-900/80" />
          </header>

          <section className="mt-2 space-y-3">
            <div className="h-28 w-full animate-pulse rounded-3xl bg-slate-900/80" />
          </section>

          <section className="mt-3 grid flex-1 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="glass-panel h-32 animate-pulse rounded-3xl bg-slate-900/80"
              />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
