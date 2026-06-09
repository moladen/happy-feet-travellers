export function Icon({ name, className = "h-5 w-5" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <path d="M4 12h7V4H4zM13 20h7v-9h-7zM13 10h7V4h-7zM4 20h7v-6H4z" />
        </svg>
      );
    case "tours":
      return (
        <svg {...common}>
          <path d="M3 12h18" />
          <path d="m5 12 3-6 4 6 4-6 3 6" />
          <path d="M5 16h14" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <path d="M8 2v4M16 2v4M4 10h16" />
          <rect x="3" y="4" width="18" height="17" rx="3" />
        </svg>
      );
    case "blogs":
      return (
        <svg {...common}>
          <path d="M6 4h9l3 3v13H6z" />
          <path d="M15 4v4h4M9 12h6M9 16h6" />
        </svg>
      );
    case "landing":
      return (
        <svg {...common}>
          <path d="M4 8h16v12H4z" />
          <path d="M4 8l8-4 8 4" />
          <path d="M9 14h6M9 17h4" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.1 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z" />
        </svg>
      );
    case "gallery":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <circle cx="9" cy="10" r="1.6" />
          <path d="m21 15-4.5-4.5L8 19" />
        </svg>
      );
    case "hero":
      return (
        <svg {...common}>
          <rect x="2" y="5" width="20" height="14" rx="3" />
          <path d="M2 10h20" />
          <path d="M8 15h8" />
          <circle cx="17" cy="8" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "team":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.2" />
          <circle cx="17" cy="9" r="2.6" />
          <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" />
          <path d="M14 20c0-2.5 1.8-4 5-4" />
        </svg>
      );
    case "enquiries":
      return (
        <svg {...common}>
          <path d="M4 6h16v12H4z" />
          <path d="m4 8 8 6 8-6" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
          <circle cx="12" cy="12" r="3.5" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M6 6 18 18M18 6 6 18" />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <path d="M10 17l5-5-5-5M15 12H3" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m20 20-4-4" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "chevronDown":
      return (
        <svg {...common}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common}>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case "eyeOff":
      return (
        <svg {...common}>
          <path d="m3 3 18 18" />
          <path d="M10.7 6.2A10.8 10.8 0 0 1 12 6c6.5 0 10 6 10 6a18.9 18.9 0 0 1-4 4.6" />
          <path d="M6.1 6.7C3.6 8.5 2 12 2 12s3.5 6 10 6c1 0 2-.1 2.9-.4" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </svg>
      );
    default:
      return null;
  }
}
