import { useRef, type ElementType, type ReactNode } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Fade + rise on enter. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'p' | 'li' | 'span';
}) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

/**
 * Word-by-word masked text reveal. Words that start with "_" are set in italic serif.
 * Pass `when` to control the trigger (e.g. after the page loader), otherwise it fires on scroll.
 */
export function RevealText({
  text,
  as: Tag = 'h2',
  className,
  delay = 0,
  when,
  stagger = 0.07,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  when?: boolean;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const show = when ?? inView;
  const clean = text.replace(/_/g, '');
  const words = text.split(' ');
  return (
    <Tag ref={ref} className={className} aria-label={clean}>
      {words.map((w, i) => {
        if (w === '|') return <br key={i} aria-hidden="true" />;
        const italic = w.startsWith('_');
        return (
          <span key={i} aria-hidden="true">
            <span className="rt-mask">
              <motion.span
                className={`rt-word${italic ? ' is-italic' : ''}`}
                initial={{ y: '115%' }}
                animate={{ y: show ? '0%' : '115%' }}
                transition={{ duration: 1.1, ease: EASE, delay: delay + i * stagger }}
              >
                {italic ? w.slice(1) : w}
              </motion.span>
            </span>
            {i < words.length - 1 && words[i + 1] !== '|' ? ' ' : null}
          </span>
        );
      })}
    </Tag>
  );
}

/**
 * Clip-path + scale image reveal.
 * The observer sits on the un-clipped outer box (a fully clipped element never reports as visible).
 */
export function ImageReveal({
  children,
  className = '',
  delay = 0,
  from = 'bottom',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: 'bottom' | 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.12 });
  const hidden =
    from === 'left'
      ? 'inset(0 100% 0 0)'
      : from === 'right'
        ? 'inset(0 0 0 100%)'
        : 'inset(100% 0 0 0)';
  return (
    <div ref={ref} className={`imgrev ${className}`}>
      <motion.div
        className="imgrev__clip"
        initial={{ clipPath: hidden }}
        animate={{ clipPath: seen ? 'inset(0% 0% 0% 0%)' : hidden }}
        transition={{ duration: 1.35, ease: [0.76, 0, 0.24, 1], delay }}
      >
        <motion.div
          className="imgrev__inner"
          initial={{ scale: 1.28 }}
          animate={{ scale: seen ? 1 : 1.28 }}
          transition={{ duration: 1.9, ease: EASE, delay }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Image that drifts slowly inside its frame while scrolling. Frame needs its own size. */
export function Parallax({
  children,
  amount = 9,
  className = '',
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const a = reduce ? 0 : amount;
  const y = useTransform(scrollYProgress, [0, 1], [`${-a}%`, `${a}%`]);
  return (
    <div ref={ref} className={`parallax ${className}`}>
      <motion.div className="parallax__inner" style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}
