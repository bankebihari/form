/**
 * Brand glyphs, drawn here rather than imported.
 *
 * lucide-react dropped its brand icons, so these are simple hand-written paths
 * on a 24-unit grid, sized by the caller through className like every other
 * icon in the app.
 */

type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M14.5 8.5V6.9c0-.7.5-1.2 1.2-1.2h1.6V2.8h-2.4c-2.4 0-4 1.6-4 4v1.7H8.4v3h2.5V21h3.6v-9.5h2.5l.4-3h-2.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect
        x="2.5"
        y="5.5"
        width="19"
        height="13"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M10.5 9.3v5.4l4.6-2.7-4.6-2.7Z" fill="currentColor" />
    </svg>
  );
}

export function WhatsappIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M3.5 20.5l1.2-4.2A8.2 8.2 0 1 1 7.9 19.3l-4.4 1.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.4 8.2c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2.1.4 0 .6l-.4.5c-.1.2-.2.3-.1.5.4.8 1.1 1.5 2 1.9.2.1.4 0 .5-.1l.5-.5c.2-.2.3-.2.5-.1l1.5.8c.4.2.4.4.4.6v.5c0 .2-.1.5-.6.7-.4.2-1 .3-1.6.1-1.2-.3-2.4-1-3.4-2-1-1-1.7-2.2-2-3.4-.2-.6-.1-1.2.1-1.6Z"
        fill="currentColor"
      />
    </svg>
  );
}
