import { Localized } from '../i18n/I18nProvider';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  return <Localized>{(
    <motion.section
      id={id}
      className="relative py-20 md:py-28"
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="chapter-heading">
          <p className="chapter-caption">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </motion.section>
  )}</Localized>;
}
