import Accents from '../Accents';
import Heading from '../Heading';
import { site } from '@/data/site';

export default function Contact() {
  const link = { color: 'inherit' } as const;
  return (
    <section id="contact" data-node="5">
      <div className="ghost" aria-hidden="true">λ</div>
      <Accents id="contact" />
      <div className="col">
        <Heading glyph="λ" kick="Contact" title="Contact" gw="αφή" gloss="(n.) haphē — touch; the point of contact." />
        <ul className="clist">
          <li><b>Email</b><a href={`mailto:${site.email}`} style={link}>{site.email}</a></li>
          <li><b>GitHub</b><a href={site.github.href} target="_blank" rel="noopener" style={link}>{site.github.label}</a></li>
          <li><b>LinkedIn</b><a href={site.linkedin.href} target="_blank" rel="noopener" style={link}>{site.linkedin.label}</a></li>
          <li><b>Based</b><span>{site.location}</span></li>
        </ul>
      </div>
      <footer className="mono" style={{ paddingLeft: 0, marginTop: '6vh' }}>{site.name} · {site.role}</footer>
    </section>
  );
}
