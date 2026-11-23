import Accents from '../Accents';
import Heading from '../Heading';

export default function About() {
  return (
    <section id="about" data-node="1">
      <div className="ghost" aria-hidden="true">γ</div>
      <Accents id="about" />
      <div className="col">
        <Heading glyph="γ" kick="About" title="About" gw="ἦθος" gloss="(n.) ēthos — character; how a person acts when the work is hard." />
        <p>I am a software engineer in San Diego, a Marine Corps veteran, and a full-time master&apos;s student in Applied AI at the University of San Diego.</p>
        <p>I build full-stack and AI/LLM applications, with React, Next.js and Python, and I care about the part between a model and a person: whether it&apos;s reliable, legible and actually useful.</p>
        <p>Four years as an Administrative NCOIC taught me to run a system under pressure. I am looking for an entry-level role, full-stack or AI/ML-adjacent, local or remote.</p>
      </div>
    </section>
  );
}
