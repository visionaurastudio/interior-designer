import type { Finish } from '../types';

interface Props {
  label: string;
  finishes: Finish[];
  value: string;
  onChange: (id: string) => void;
  size?: 'md' | 'sm';
}

/** A labelled group of finish swatches. Each is a real button; the selected one is announced via aria-pressed. */
export default function Swatches({ label, finishes, value, onChange, size = 'md' }: Props) {
  return (
    <div role="group" aria-label={label} className={`swatches swatches--${size}`}>
      {finishes.map((f) => {
        const on = f.id === value;
        return (
          <button
            key={f.id}
            type="button"
            className={`sw${on ? ' is-on' : ''}`}
            aria-pressed={on}
            aria-label={f.name}
            title={f.name}
            onClick={() => onChange(f.id)}
          >
            <span className={`sw__chip${f.texture ? ` tx-${f.texture}` : ''}`} style={{ backgroundColor: f.color }}>
              {on && (
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <path d="M3 8.5l3.2 3.2L13 5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              )}
            </span>
            <span className="sw__name">{f.name}</span>
          </button>
        );
      })}
    </div>
  );
}
