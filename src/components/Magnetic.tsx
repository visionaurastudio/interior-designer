import { useRef, type ReactNode, type MouseEvent, type AnchorHTMLAttributes } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type Variant = 'solid' | 'ghost';

interface Props extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'> {
  children: ReactNode;
  variant?: Variant;
  onClick?: () => void;
  as?: 'a' | 'button';
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const fine = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Pill CTA that leans gently toward the cursor on desktop. */
export default function Button({
  children,
  variant = 'solid',
  onClick,
  as = 'a',
  type = 'button',
  disabled,
  href,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const move = (e: MouseEvent) => {
    if (!fine() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.32);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <>
      <span className="btn__label">{children}</span>
      <svg className="btn__arrow" width="18" height="10" viewBox="0 0 18 10" aria-hidden="true">
        <path d="M0 5h16M12 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </>
  );
  const cls = `btn btn--${variant}`;

  return (
    <motion.span className="btn-wrap" style={{ x, y }} onMouseMove={move} onMouseLeave={leave}>
      {as === 'button' ? (
        <button ref={ref as React.RefObject<HTMLButtonElement>} className={cls} type={type} onClick={onClick} disabled={disabled}>
          {inner}
        </button>
      ) : (
        <a
          ref={ref as React.RefObject<HTMLAnchorElement>}
          className={cls}
          href={href}
          onClick={(e) => {
            if (onClick) {
              e.preventDefault();
              onClick();
            }
          }}
          {...rest}
        >
          {inner}
        </a>
      )}
    </motion.span>
  );
}
