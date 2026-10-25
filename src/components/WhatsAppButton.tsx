import { waUrl } from '../config';

/** Fixed WhatsApp button. Opens a chat with the business number and a pre-filled message the visitor can review and send. */
export default function WhatsAppButton() {
  return (
    <a
      className="wa"
      href={waUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M12.04 2a9.9 9.9 0 0 0-8.5 14.96L2 22l5.2-1.36A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 1 1-4.13 15.07l-.3-.18-3.08.8.82-3-.2-.31A8.1 8.1 0 0 1 12.04 3.8zm-3.2 3.9c-.2 0-.5.07-.77.37-.26.3-1 1-1 2.45s1.06 2.84 1.2 3.04c.15.2 2.07 3.3 5.1 4.5 2.52 1 3.03.8 3.57.75.55-.05 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.41-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57z"
        />
      </svg>
    </a>
  );
}
