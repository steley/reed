import { useEffect, useRef, useState } from "react";
import { X } from "./icons.tsx";

interface Props {
  open: boolean;
  onOpenChange(open: boolean): void;
  onAdd(url: string): Promise<void>; // throws on failure
}

export function AddFeedDialog({ open, onOpenChange, onAdd }: Props) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUrl("");
      setError(null);
      setSubmitting(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!/^https?:\/\/\S+\.\S+/.test(trimmed)) {
      setError("Enter a valid http(s) URL");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onAdd(trimmed);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 pt-[18vh]">
      <div className="absolute inset-0" onClick={() => onOpenChange(false)} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add feed"
        className="relative w-full max-w-md rounded-2xl border border-line bg-canvas p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight">Add feed</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="rounded-lg p-1.5 text-ink-3 hover:bg-card hover:text-ink"
          >
            <X width={15} height={15} />
          </button>
        </div>

        <form onSubmit={submit}>
          <input
            ref={inputRef}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/feed.xml"
            spellCheck={false}
            autoComplete="off"
            className="w-full rounded-lg border border-line bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-accent"
          />
          {error && <p className="mt-2 text-[13px] text-accent">{error}</p>}
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-ink-2 transition-colors hover:bg-card hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-accent px-3.5 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Adding…" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
