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

export const RssLogo = (props: P) => (
  <svg {...base(props)} strokeWidth={2.2}>
    <path d="M4 11a9 9 0 0 1 9 9" />
    <path d="M4 4a16 16 0 0 1 16 16" />
    <circle cx="5" cy="19" r="1.6" fill="currentColor" stroke="none" />
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
