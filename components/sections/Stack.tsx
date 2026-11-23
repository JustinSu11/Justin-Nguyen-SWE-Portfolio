import Accents from '../Accents';
import Heading from '../Heading';
import { stack } from '@/data/stack';

export default function Stack() {
  return (
    <section id="stack" data-node="3">
      <div className="ghost" aria-hidden="true">τ</div>
      <Accents id="stack" />
      <div className="col">
        <Heading glyph="τ" kick="Stack" title="Stack" gw="τέχνη" gloss="(n.) technē — craft; knowing how, not only knowing that." />
        {stack.map((g) => (
          <div className="stack-g" key={g.title}>
            <h4>{g.title}</h4>
            <div className="tags">{g.items.map((t) => <span key={t}>{t}</span>)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
