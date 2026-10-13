import { ReedMark } from "./icons.tsx";

/**
 * Public landing page — the first thing an unauthenticated visitor sees.
 * Static by design: no API calls, just a pitch and a login link.
 */

const FEATURES = [
  {
    title: "Reader mode built in",
    body: "Feeds that only ship a summary get the full article pulled from the original page, cleaned up for reading.",
  },
  {
    title: "Folders & OPML",
    body: "Organize feeds into folders and bring your subscriptions from any other reader via OPML import.",
  },
  {
    title: "Feed health at a glance",
    body: "A feed that fails to refresh is flagged right in the sidebar — no more silently dead subscriptions.",
  },
  {
    title: "Dark mode",
    body: "Follows your system preference, or flip it manually from the sidebar. Your eyes, your rules.",
  },
];

const SHORTCUTS = [
  { keys: ["j", "k"], desc: "Next / previous article" },
  { keys: ["v"], desc: "Open the original page" },
  { keys: ["r"], desc: "Refresh the current view" },
];

export function Landing() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-center gap-2.5">
          <ReedMark width={28} height={28} />
          <span className="text-[15px] font-semibold tracking-tight">Reed</span>
        </div>
        <a
          href="#/login"
          className="rounded-lg border border-line bg-panel px-4 py-1.5 text-sm text-ink transition-colors hover:border-accent"
        >
          Sign in
        </a>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center px-6 text-center">
        <section className="flex flex-col items-center pt-16 pb-20 md:pt-24 md:pb-28">
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight md:text-5xl">
            Read your RSS in peace
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-3">
            A minimal, self-hosted reader. No recommendations, no reading list — just you and your
            feeds.
          </p>
          <a
            href="#/login"
            className="mt-8 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Get started
          </a>
        </section>

        {/* Features */}
        <section className="w-full max-w-3xl pb-20">
          <h2 className="text-xl font-semibold tracking-tight">Small, on purpose</h2>
          <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-line bg-panel p-5">
                <h3 className="text-[15px] font-medium">{f.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Keyboard shortcuts */}
        <section className="w-full max-w-md pb-20">
          <h2 className="text-xl font-semibold tracking-tight">Keyboard first</h2>
          <p className="mt-2 text-[13px] text-ink-3">
            Your hands never have to leave the keyboard.
          </p>
          <dl className="mt-6 flex flex-col gap-3">
            {SHORTCUTS.map((s) => (
              <div
                key={s.keys.join()}
                className="flex items-center justify-between rounded-lg border border-line bg-panel px-4 py-2.5"
              >
                <dt className="flex gap-1.5">
                  {s.keys.map((k) => (
                    <kbd
                      key={k}
                      className="min-w-7 rounded-md border border-line bg-canvas px-2 py-0.5 text-center font-mono text-[13px] text-ink"
                    >
                      {k}
                    </kbd>
                  ))}
                </dt>
                <dd className="text-[13px] text-ink-3">{s.desc}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <footer className="pb-6 text-center text-xs text-ink-3">Reed</footer>
    </div>
  );
}
