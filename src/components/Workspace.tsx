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
  editorMode: 'layout' | 'flow' | 'preview';
  flows: UIFlow[];
  previewCanGoBack: boolean;
  previewScreen: UIScreen | undefined;
  screen: UIScreen | undefined;
  screens: UIScreen[];
  selectedFlowId: string | null;
  selectedElementId: string | null;
  selectedScreenId: string;
  onCreateFlow: (fromScreenId: string, toScreenId: string) => void;
  onNavigatePreview: (elementId: string) => void;
  onPreviewBack: () => void;
  onPreviewReset: () => void;
  onMoveElement: (elementId: string, x: number, y: number) => void;
  onSelectFlow: (flowId: string | null) => void;
  onSelectElement: (elementId: string) => void;
  onSelectScreen: (screenId: string) => void;
};

export function Workspace({
  editorMode,
  flows,
  previewCanGoBack,
  previewScreen,
  screen,
  screens,
  selectedFlowId,
  selectedElementId,
  selectedScreenId,
  onCreateFlow,
  onNavigatePreview,
  onPreviewBack,
  onPreviewReset,
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
        {editorMode === 'preview' && previewScreen ? (
          <span className="screen-type">{previewScreen.type}</span>
        ) : screen ? (
          <span className="screen-type">{screen.type}</span>
        ) : null}
      </section>

      {editorMode === 'preview' ? (
        <section className="preview-shell">
          <header className="preview-header">
            <strong>{previewScreen?.name ?? 'No preview screen'}</strong>
            <div>
              <button type="button" disabled={!previewCanGoBack} onClick={onPreviewBack}>
                Back
              </button>
              <button type="button" onClick={onPreviewReset}>
                Reset
              </button>
            </div>
          </header>
          <div className="canvas preview-canvas">
            {previewScreen?.elements.map((element) => {
              const clickFlow = flows.find(
                (flow) =>
                  flow.fromScreenId === previewScreen.id &&
                  flow.fromElementId === element.id &&
                  flow.trigger.trim().toLowerCase() === 'click',
              );

              return (
                <button
                  className={`ui-element preview-element ${element.type} ${clickFlow ? 'clickable' : ''}`}
                  disabled={!clickFlow}
                  key={element.id}
                  type="button"
                  style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                  }}
                  onClick={() => onNavigatePreview(element.id)}
                >
                  <span>{element.label || element.name}</span>
                </button>
              );
            })}
          </div>
        </section>
      ) : editorMode === 'flow' ? (
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
