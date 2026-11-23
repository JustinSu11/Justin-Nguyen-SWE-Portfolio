import { accents } from '@/data/accents';

export default function Accents({ id }: { id: keyof typeof accents }) {
  return (
    <>
      {accents[id].map((a, i) => {
        const base = `ac ${a.kind}${'mod' in a && a.mod ? ' ' + a.mod : ''}`;
        switch (a.kind) {
          case 'vt':
            return <div key={i} className={base} style={a.style}>{a.text}</div>;
          case 'cas':
            return (
              <div key={i} className={base} style={a.style}>
                {a.squares.map((q, j) => (
                  <i key={j} className={q.red ? 'r' : undefined} style={{ left: q.x, top: q.y }} />
                ))}
              </div>
            );
          case 'ds':
            return (
              <div key={i} className={base} style={a.style}>
                <i className="da" /><i className="ba" /><i className="do" /><i className="do" /><i className="do" />
                <i className={a.lastRed ? 'do r' : 'do'} />
              </div>
            );
          case 'gw':
            return (
              <div key={i} className={base} style={a.style}>
                <b>{a.word}</b><span className="tw" data-t={a.def} />
              </div>
            );
          default:
            return <div key={i} className={base} style={a.style} />;
        }
      })}
    </>
  );
}
