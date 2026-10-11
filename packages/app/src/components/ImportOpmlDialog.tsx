import { useEffect, useRef, useState } from "react";
import type { OpmlImportResult } from "../lib/api.ts";
import { X } from "./icons.tsx";

interface Props {
  open: boolean;
  onOpenChange(open: boolean): void;
  /** Reads the OPML text against the API; throws on failure */
  onImport(text: string): Promise<OpmlImportResult>;
}

export function ImportOpmlDialog({ open, onOpenChange, onImport }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OpmlImportResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setFile(null);
      setError(null);
      setResult(null);
      setSubmitting(false);
      setTimeout(() => primaryRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const pickFile = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResult(null);
    setFile(e.target.files?.[0] ?? null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setSubmitting(true);
    setError(null);
    try {
      const text = await file.text();
      setResult(await onImport(text));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => onOpenChange(false);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 pt-[18vh]">
      <div className="absolute inset-0" onClick={close} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Import OPML"
        className="relative w-full max-w-md rounded-2xl border border-line bg-canvas p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight">Import OPML</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="rounded-lg p-1.5 text-ink-3 hover:bg-card hover:text-ink"
          >
            <X width={15} height={15} />
          </button>
        </div>

        {result ? (
          <>
            <p className="text-sm text-ink">
              Imported {result.feedsAdded} feed{result.feedsAdded === 1 ? "" : "s"}, created{" "}
              {result.foldersCreated} folder{result.foldersCreated === 1 ? "" : "s"}, skipped{" "}
              {result.feedsSkipped} duplicate{result.feedsSkipped === 1 ? "" : "s"}.
            </p>
            <p className="mt-2 text-[13px] text-ink-3">
              New feeds will fill in with the next refresh.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                ref={primaryRef}
                onClick={close}
                className="rounded-lg bg-accent px-3.5 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Done
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={submit}>
            <p className="text-[13px] leading-relaxed text-ink-2">
              Choose an .opml file exported from another reader. Folders and feeds inside it will be
              added; feeds you already subscribe to are skipped.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".opml,.xml,text/xml,text/plain"
              onChange={onFileChange}
              className="hidden"
            />
            <button
              type="button"
              ref={primaryRef}
              onClick={pickFile}
              className="mt-4 flex w-full items-center justify-between rounded-lg border border-line bg-panel px-3.5 py-2.5 text-left text-sm text-ink transition-colors hover:border-accent"
            >
              <span className={file ? "" : "text-ink-3"}>{file ? file.name : "Choose file…"}</span>
              {file && (
                <span className="text-[12px] text-ink-3">{Math.ceil(file.size / 1024)} KB</span>
              )}
            </button>
            {error && <p className="mt-2 text-[13px] text-accent">{error}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
                className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-ink-2 transition-colors hover:bg-card hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!file || submitting}
                className="rounded-lg bg-accent px-3.5 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Importing…" : "Import"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
