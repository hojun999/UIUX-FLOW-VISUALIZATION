import type { UIScreen } from '../types';

type WorkspaceProps = {
  screen: UIScreen | undefined;
};

export function Workspace({ screen }: WorkspaceProps) {
  return (
    <main className="workspace">
      <section className="workspace-header">
        <div>
          <p className="eyebrow">Selected Screen</p>
          <h2>{screen?.name ?? 'No screen selected'}</h2>
        </div>
        {screen ? <span className="screen-type">{screen.type}</span> : null}
      </section>

      <section className="canvas-shell">
        <div className="canvas">
          {screen?.elements.map((element) => (
            <div
              className={`ui-element ${element.type}`}
              key={element.id}
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
              }}
            >
              <span>{element.name}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
