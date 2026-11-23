export default function Heading(p: { glyph: string; kick: string; title: string; gw: string; gloss: string }) {
  return (
    <>
      <div className="kick mono"><i>{p.glyph}</i>{p.kick}</div>
      <h2>{p.title}</h2>
      <div className="gk mono"><b>{p.gw}</b>{p.gloss}</div>
    </>
  );
}
