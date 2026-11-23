import Accents from '../Accents';

const eqs = [
  ['E-2 → E-4  ·  t ∈ [2019, 2023]', 'USMC · four years running administrative systems'],
  ['B.S. → M.S.  ·  CS → Applied AI', 'Texas A&M–CC · University of San Diego'],
  ['shipped = { BeautyByAmy, Charles }', 'Full-stack and LLM projects · built end to end'],
];

export default function Home() {
  return (
    <section id="home" data-node="0">
      <Accents id="home" />
      <div className="col" style={{ width: 'min(560px,50vw)' }}>
        {eqs.map(([eq, c]) => (
          <div key={eq}>
            <div className="eq">{eq}</div>
            <div className="eqc mono">{c}</div>
          </div>
        ))}
      </div>
      <div className="weave" aria-hidden="true"><svg className="wsvg" /></div>
      <h1 className="name">{[...'Justin'].map((ch, i) => <span key={i}>{ch}</span>)}</h1>
      <div className="roles mono">
        <div><s />Software engineer · Applied AI</div>
        <div><s />USMC veteran</div>
      </div>
      <div className="scrollcue mono">Scroll</div>
    </section>
  );
}
