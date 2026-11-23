import Accents from '../Accents';
import Heading from '../Heading';
import { experience } from '@/data/experience';

export default function Experience() {
  return (
    <section id="experience" data-node="4">
      <div className="ghost" aria-hidden="true">β</div>
      <Accents id="experience" />
      <div className="col">
        <Heading glyph="β" kick="Résumé" title="Experience" gw="χρόνος" gloss="(n.) chronos — time, measured in what you did with it." />
        <div className="tl" id="tl">
          <div className="rail"><div className="prog" id="prog" /></div>
          {experience.map((m) => (
            <div className="te" key={m.date}>
              <div className="d">{m.date}</div>
              <h3>{m.title}</h3>
              <p>{m.detail}</p>
            </div>
          ))}
        </div>
        <a className="btn" href="/Justin_Nguyen_Resume.pdf" download>Download résumé</a>
      </div>
    </section>
  );
}
