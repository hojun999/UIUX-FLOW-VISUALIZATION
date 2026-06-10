import { FlowEditor } from './FlowEditor';
import type { UIFlow } from '../types';
import type { UIScreen } from '../types';

const canvasSize = {
  width: 800,
  height: 480,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

type WorkspaceProps = {
  editorMode: 'layout' | 'flow';
  flows: UIFlow[];
  screen: UIScreen | undefined;
  screens: UIScreen[];
  selectedFlowId: string | null;
  selectedElementId: string | null;
  selectedScreenId: string;
  onCreateFlow: (fromScreenId: string, toScreenId: string) => void;
  onMoveElement: (elementId: string, x: number, y: number) => void;
  onSelectFlow: (flowId: string | null) => void;
  onSelectElement: (elementId: string) => void;
  onSelectScreen: (screenId: string) => void;
};

export function Workspace({
  editorMode,
  flows,
  screen,
  screens,
  selectedFlowId,
  selectedElementId,
  selectedScreenId,
  onCreateFlow,
  onMoveElement,
  onSelectFlow,
  onSelectElement,
  onSelectScreen,
}: WorkspaceProps) {
  return (
    <main className="workspace">
      <section className="workspace-header">
        <div>
          <p className="eyebrow">Selected Screen</p>
          <h2>{screen?.name ?? 'No screen selected'}</h2>
        </div>
        {screen ? <span className="screen-type">{screen.type}</span> : null}
      </section>

      {editorMode === 'flow' ? (
        <FlowEditor
          flows={flows}
          screens={screens}
          selectedFlowId={selectedFlowId}
          selectedScreenId={selectedScreenId}
          onCreateFlow={onCreateFlow}
          onSelectFlow={onSelectFlow}
          onSelectScreen={onSelectScreen}
        />
      ) : (
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
                {flows.some((flow) => flow.fromScreenId === screen.id && flow.fromElementId === element.id) ? (
                  <span className="flow-indicator" aria-label="Has outgoing flow" title="Has outgoing flow" />
                ) : null}
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
