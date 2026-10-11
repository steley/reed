import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

/** Brand mark: three wind-swept reeds. Ember plumes on ink stems (theme-aware). */
export const ReedMark = (props: P) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    strokeLinecap="round"
    aria-hidden
    {...props}
  >
    <g stroke="var(--color-ink)" strokeWidth={2.2}>
      <path d="M6.3 20.5 C6.5 18.4 6.9 16.5 7.4 14.8" />
      <path d="M11 20.5 C10.8 15.6 10.9 10.9 11 6.6" />
      <path d="M15.8 20.5 C16.1 17.1 16.3 13.5 16.5 10.2" />
    </g>
    <path d="M4 21 H20" stroke="var(--color-ink-3)" strokeWidth={1.8} />
    <g fill="var(--color-accent)">
      <path d="M7.4 15.4 C7.1 13.7 7.6 12 9.2 10.8 C9.4 12.6 8.8 14.2 7.4 15.4 Z" />
      <path d="M11 7.6 C10.7 4.9 11.3 2.6 13.4 1.1 C13.7 3.8 12.8 6 11 7.6 Z" />
      <path d="M16.5 11 C16.2 9 16.7 7.2 18.6 5.8 C18.8 7.8 18.1 9.7 16.5 11 Z" />
    </g>
  </svg>
);

export const Plus = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Refresh = (props: P) => (
  <svg {...base(props)}>
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <path d="M21 3v6h-6" />
  </svg>
);

export const Sun = (props: P) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const Moon = (props: P) => (
  <svg {...base(props)}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
);

export const Sort = (props: P) => (
  <svg {...base(props)}>
    <path d="M7 4v16m0 0-3-3m3 3 3-3" />
    <path d="M17 20V4m0 0-3 3m3-3 3 3" />
  </svg>
);

export const External = (props: P) => (
  <svg {...base(props)}>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
  </svg>
);

export const MarkUnread = (props: P) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="8" />
    <path d="M8 12h8" />
  </svg>
);

export const Trash = (props: P) => (
  <svg {...base(props)}>
    <path d="M3 6h18" />
    <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </svg>
);

export const Menu = (props: P) => (
  <svg {...base(props)}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const ArrowLeft = (props: P) => (
  <svg {...base(props)}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

export const X = (props: P) => (
  <svg {...base(props)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const Folder = (props: P) => (
  <svg {...base(props)}>
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </svg>
);

export const FolderPlus = (props: P) => (
  <svg {...base(props)}>
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    <path d="M12 10v6" />
    <path d="M9 13h6" />
  </svg>
);

export const ChevronRight = (props: P) => (
  <svg {...base(props)}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const Ellipsis = (props: P) => (
  <svg {...base(props)}>
    <circle cx="5" cy="12" r="0.8" fill="currentColor" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    <circle cx="19" cy="12" r="0.8" fill="currentColor" />
  </svg>
);

export const MarkAllRead = (props: P) => (
  <svg {...base(props)}>
    <path d="M18 6 7 17l-4-4" />
    <path d="m22 10-7.5 7.5L13 16" />
  </svg>
);
