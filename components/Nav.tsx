import { sections } from '@/data/site';

export default function Nav() {
  return (
    <nav aria-label="Sections">
      {sections.map((s) => <a key={s.id} className="sr" href={`#${s.id}`}>{s.label}</a>)}
    </nav>
  );
}
