import Accents from '../Accents';
import Heading from '../Heading';
import { projects } from '@/data/projects';

export default function Works() {
  return (
    <section id="works" data-node="2">
      <div className="ghost" aria-hidden="true">ε</div>
      <Accents id="works" />
      <div className="col">
        <Heading glyph="ε" kick="Works" title="Works" gw="ἔργον" gloss="(n.) ergon — work, deed; what remains after the effort." />
        {projects.map((p) => (
          <div className="card" key={p.name}>
            <h3>{p.name}</h3>
            <p>{p.blurb}</p>
            <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
            <p style={{ margin: '10px 0 0' }}>
              {p.live && (<><a href={p.live} target="_blank" rel="noopener">Live ↗</a>{'  '}</>)}
              <a href={p.source} target="_blank" rel="noopener">Source ↗</a>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
