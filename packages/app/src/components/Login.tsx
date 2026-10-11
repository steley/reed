import { useRef, useState } from "react";
import { authApi } from "../lib/api.ts";
import { ReedMark } from "./icons.tsx";

interface Props {
  onAuthed(): void;
}

/**
 * Full-screen login/register gate. One form, two modes — the invite-code
 * field only appears in register mode (the server decides whether one is
 * required; an unnecessary field stays empty and is simply not sent).
 */
export function Login({ onAuthed }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "login") {
        await authApi.login(email.trim(), password);
      } else {
        await authApi.register(email.trim(), password, code.trim() || undefined);
      }
      onAuthed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-dvh items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <ReedMark width={40} height={40} />
          <h1 className="text-lg font-semibold tracking-tight text-ink">Reed</h1>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            ref={emailRef}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="w-full rounded-lg border border-line bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-accent"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="w-full rounded-lg border border-line bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-accent"
          />
          {mode === "register" && (
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Invite code (if required)"
              autoComplete="off"
              className="w-full rounded-lg border border-line bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-accent"
            />
          )}

          {error && <p className="text-[13px] text-accent">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-lg bg-accent px-3.5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError(null);
          }}
          className="mt-5 w-full text-center text-[13px] text-ink-3 transition-colors hover:text-ink"
        >
          {mode === "login" ? "No account yet? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
