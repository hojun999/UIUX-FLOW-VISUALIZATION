import type { UIScreen } from '../types';

const canvasSize = {
  width: 800,
  height: 480,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

type WorkspaceProps = {
  screen: UIScreen | undefined;
  selectedElementId: string | null;
  onMoveElement: (elementId: string, x: number, y: number) => void;
  onSelectElement: (elementId: string) => void;
};

export function Workspace({ screen, selectedElementId, onMoveElement, onSelectElement }: WorkspaceProps) {
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
              onPointerDown={(event) => {
                const canvas = event.currentTarget.parentElement;

                if (!canvas) {
                  return;
                }

                event.preventDefault();
                onSelectElement(element.id);

                const canvasRect = canvas.getBoundingClientRect();
                const pointerOffsetX = event.clientX - canvasRect.left - element.x;
                const pointerOffsetY = event.clientY - canvasRect.top - element.y;
                const maxX = canvasSize.width - element.width;
                const maxY = canvasSize.height - element.height;

                function handlePointerMove(moveEvent: PointerEvent) {
                  const nextX = clamp(moveEvent.clientX - canvasRect.left - pointerOffsetX, 0, maxX);
                  const nextY = clamp(moveEvent.clientY - canvasRect.top - pointerOffsetY, 0, maxY);

                  onMoveElement(element.id, Math.round(nextX), Math.round(nextY));
                }

                function handlePointerUp() {
                  window.removeEventListener('pointermove', handlePointerMove);
                  window.removeEventListener('pointerup', handlePointerUp);
                }

                window.addEventListener('pointermove', handlePointerMove);
                window.addEventListener('pointerup', handlePointerUp, { once: true });
              }}
            >
              <span>{element.label || element.name}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
