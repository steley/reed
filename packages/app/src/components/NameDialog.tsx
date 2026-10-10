import { useEffect, useRef, useState } from "react";
import { X } from "./icons.tsx";

interface Props {
  open: boolean;
  title: string;
  initial?: string;
  submitLabel: string;
  onOpenChange(open: boolean): void;
  onSubmit(name: string): Promise<void>; // throws on failure
}

/** Generic single-name prompt dialog (new folder, rename folder). */
export function NameDialog({
  open,
  title,
  initial = "",
  submitLabel,
  onOpenChange,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(initial);
      setError(null);
      setSubmitting(false);
      setTimeout(() => inputRef.current?.select(), 50);
    }
  }, [open, initial]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Enter a name");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(trimmed);
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
        aria-label={title}
        className="relative w-full max-w-md rounded-2xl border border-line bg-canvas p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Folder name"
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
              {submitting ? "Saving…" : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
