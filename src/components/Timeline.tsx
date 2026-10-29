import type { TimelineEntry } from '../types';
import Reveal from './Reveal';

export default function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="timeline">
      {entries.map((e, i) => (
        <Reveal as="li" key={`${e.year}-${e.title}`} delay={i * 90} className="timeline-item">
          <span className="timeline-year">{e.year}</span>
          <h3>{e.title}</h3>
          <p>{e.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}
