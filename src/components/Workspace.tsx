import type { UIScreen } from '../types';

type WorkspaceProps = {
  screen: UIScreen | undefined;
  selectedElementId: string | null;
  onSelectElement: (elementId: string) => void;
};

export function Workspace({ screen, selectedElementId, onSelectElement }: WorkspaceProps) {
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
            <button
              className={`ui-element ${element.type} ${selectedElementId === element.id ? 'selected' : ''}`}
              key={element.id}
              type="button"
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
              }}
              onClick={() => onSelectElement(element.id)}
            >
              <span>{element.label || element.name}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
