import type { UIElement, UIFlow, UIScreen, UIScreenType } from '../types';

const screenTypes: UIScreenType[] = ['mainMenu', 'hud', 'pauseMenu', 'inventory', 'settings', 'modal'];

type RightInspectorProps = {
  canDeleteScreen: boolean;
  editorMode: 'layout' | 'flow' | 'preview';
  flows: UIFlow[];
  selectedFlow: UIFlow | undefined;
  selectedElement: UIElement | undefined;
  screen: UIScreen | undefined;
  screens: UIScreen[];
  importError: string | null;
  onCreateElementFlow: (toScreenId: string) => void;
  onDeleteScreen: () => void;
  onDeleteElement: () => void;
  onDeleteFlow: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onResetSampleProject: () => void;
  onSetEditorMode: (mode: 'layout' | 'flow' | 'preview') => void;
  onUpdateElement: (patch: Partial<Omit<UIElement, 'id' | 'type'>>) => void;
  onUpdateFlow: (
    patch: Partial<Pick<UIFlow, 'fromScreenId' | 'fromElementId' | 'toScreenId' | 'trigger' | 'description' | 'condition'>>,
  ) => void;
  onUpdateScreenName: (name: string) => void;
  onUpdateScreenType: (type: UIScreenType) => void;
};

export function RightInspector({
  canDeleteScreen,
  editorMode,
  flows,
  selectedFlow,
  selectedElement,
  screen,
  screens,
  importError,
  onCreateElementFlow,
  onDeleteScreen,
  onDeleteElement,
  onDeleteFlow,
  onExportJson,
  onImportJson,
  onResetSampleProject,
  onSetEditorMode,
  onUpdateElement,
  onUpdateFlow,
  onUpdateScreenName,
  onUpdateScreenType,
}: RightInspectorProps) {
  const flowSourceScreen = selectedFlow
    ? screens.find((candidateScreen) => candidateScreen.id === selectedFlow.fromScreenId)
    : undefined;

  return (
    <aside className="right-inspector">
      <section className="inspector-panel">
        <h2>Editor Mode</h2>
        <div className="mode-switcher" role="group" aria-label="Editor mode">
          <button
            className={editorMode === 'layout' ? 'active' : ''}
            type="button"
            onClick={() => onSetEditorMode('layout')}
          >
            Layout
          </button>
          <button
            className={editorMode === 'flow' ? 'active' : ''}
            type="button"
            onClick={() => onSetEditorMode('flow')}
          >
            Flow
          </button>
          <button
            className={editorMode === 'preview' ? 'active' : ''}
            type="button"
            onClick={() => onSetEditorMode('preview')}
          >
            Preview
          </button>
        </div>
        <button className="reset-sample-button" type="button" onClick={onResetSampleProject}>
          Reset Sample Project
        </button>
        <div className="json-actions">
          <button type="button" onClick={onExportJson}>
            Export JSON
          </button>
          <label>
            Import JSON
            <input
              accept="application/json,.json"
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  onImportJson(file);
                  event.currentTarget.value = '';
                }
              }}
            />
          </label>
        </div>
        {importError ? <p className="error-message">{importError}</p> : null}
      </section>

      <h2>Inspector</h2>
      {editorMode !== 'preview' && screen ? (
        <div className="inspector-panel">
          <label className="field-label" htmlFor="screen-name">
            Screen Name
            <input
              id="screen-name"
              value={screen.name}
              onChange={(event) => onUpdateScreenName(event.target.value)}
            />
          </label>

          <label className="field-label" htmlFor="screen-type">
            Screen Type
            <select
              id="screen-type"
              value={screen.type}
              onChange={(event) => onUpdateScreenType(event.target.value as UIScreenType)}
            >
              {screenTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <dl className="screen-details">
            <div>
              <dt>Screen ID</dt>
              <dd>{screen.id}</dd>
            </div>
            <div>
              <dt>Elements</dt>
              <dd>{screen.elements.length}</dd>
            </div>
          </dl>

          <button
            className="delete-screen-button"
            disabled={!canDeleteScreen}
            type="button"
            onClick={onDeleteScreen}
          >
            Delete Screen
          </button>
          {!canDeleteScreen ? <p className="hint-text">At least one screen is required.</p> : null}
        </div>
      ) : editorMode !== 'preview' ? (
        <p className="empty-state">Select a screen to inspect it.</p>
      ) : null}

      {editorMode === 'preview' ? (
        <p className="empty-state">Preview follows element flows where trigger is set to click.</p>
      ) : null}

      {editorMode === 'flow' && selectedFlow ? (
        <div className="inspector-panel">
          <h2>Flow</h2>
          <dl className="screen-details">
            <div>
              <dt>Flow ID</dt>
              <dd>{selectedFlow.id}</dd>
            </div>
            <div>
              <dt>From</dt>
              <dd>{selectedFlow.fromScreenId}</dd>
            </div>
            <div>
              <dt>To</dt>
              <dd>{selectedFlow.toScreenId}</dd>
            </div>
          </dl>

          <label className="field-label" htmlFor="flow-trigger">
            From Screen
            <select
              id="flow-from-screen"
              value={selectedFlow.fromScreenId}
              onChange={(event) => onUpdateFlow({ fromScreenId: event.target.value, fromElementId: undefined })}
            >
              {screens.map((candidateScreen) => (
                <option key={candidateScreen.id} value={candidateScreen.id}>
                  {candidateScreen.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field-label" htmlFor="flow-from-element">
            From Element
            <select
              id="flow-from-element"
              value={selectedFlow.fromElementId ?? ''}
              onChange={(event) => onUpdateFlow({ fromElementId: event.target.value || undefined })}
            >
              <option value="">Screen-level flow</option>
              {flowSourceScreen?.elements.map((element) => (
                <option key={element.id} value={element.id}>
                  {element.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field-label" htmlFor="flow-to-screen">
            To Screen
            <select
              id="flow-to-screen"
              value={selectedFlow.toScreenId}
              onChange={(event) => onUpdateFlow({ toScreenId: event.target.value })}
            >
              {screens.map((candidateScreen) => (
                <option key={candidateScreen.id} value={candidateScreen.id}>
                  {candidateScreen.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field-label" htmlFor="flow-trigger">
            Trigger
            <input
              id="flow-trigger"
              value={selectedFlow.trigger}
              onChange={(event) => onUpdateFlow({ trigger: event.target.value })}
            />
          </label>

          <label className="field-label" htmlFor="flow-description">
            Description
            <textarea
              id="flow-description"
              value={selectedFlow.description}
              onChange={(event) => onUpdateFlow({ description: event.target.value })}
            />
          </label>

          <label className="field-label" htmlFor="flow-condition">
            Condition
            <textarea
              id="flow-condition"
              value={selectedFlow.condition}
              onChange={(event) => onUpdateFlow({ condition: event.target.value })}
            />
          </label>

          <button className="delete-screen-button" type="button" onClick={onDeleteFlow}>
            Delete Flow
          </button>
        </div>
      ) : null}

      {editorMode === 'flow' && !selectedFlow ? (
        <p className="empty-state">Select a flow edge to edit it.</p>
      ) : null}

      {editorMode === 'layout' && selectedElement ? (
        <div className="inspector-panel">
          <h2>Element</h2>
          <dl className="screen-details">
            <div>
              <dt>Element Type</dt>
              <dd>{selectedElement.type}</dd>
            </div>
            <div>
              <dt>Element ID</dt>
              <dd>{selectedElement.id}</dd>
            </div>
          </dl>

          <label className="field-label" htmlFor="element-name">
            Name
            <input
              id="element-name"
              value={selectedElement.name}
              onChange={(event) => onUpdateElement({ name: event.target.value })}
            />
          </label>

          <label className="field-label" htmlFor="element-label">
            Label
            <input
              id="element-label"
              value={selectedElement.label}
              onChange={(event) => onUpdateElement({ label: event.target.value })}
            />
          </label>

          <div className="property-grid">
            <label className="field-label" htmlFor="element-x">
              X
              <input
                id="element-x"
                type="number"
                value={selectedElement.x}
                onChange={(event) => onUpdateElement({ x: Number(event.target.value) })}
              />
            </label>
            <label className="field-label" htmlFor="element-y">
              Y
              <input
                id="element-y"
                type="number"
                value={selectedElement.y}
                onChange={(event) => onUpdateElement({ y: Number(event.target.value) })}
              />
            </label>
            <label className="field-label" htmlFor="element-width">
              Width
              <input
                id="element-width"
                type="number"
                value={selectedElement.width}
                onChange={(event) => onUpdateElement({ width: Number(event.target.value) })}
              />
            </label>
            <label className="field-label" htmlFor="element-height">
              Height
              <input
                id="element-height"
                type="number"
                value={selectedElement.height}
                onChange={(event) => onUpdateElement({ height: Number(event.target.value) })}
              />
            </label>
          </div>

          <label className="field-label" htmlFor="element-description">
            Description
            <textarea
              id="element-description"
              value={selectedElement.description}
              onChange={(event) => onUpdateElement({ description: event.target.value })}
            />
          </label>

          <button className="delete-screen-button" type="button" onClick={onDeleteElement}>
            Delete Element
          </button>

          <label className="field-label" htmlFor="element-flow-target">
            Create Flow To
            <select
              id="element-flow-target"
              defaultValue=""
              onChange={(event) => {
                if (event.target.value) {
                  onCreateElementFlow(event.target.value);
                  event.currentTarget.value = '';
                }
              }}
            >
              <option value="" disabled>
                Select target screen
              </option>
              {screens
                .filter((candidateScreen) => candidateScreen.id !== screen?.id)
                .map((candidateScreen) => (
                  <option key={candidateScreen.id} value={candidateScreen.id}>
                    {candidateScreen.name}
                  </option>
                ))}
            </select>
          </label>

          {flows.some((flow) => flow.fromScreenId === screen?.id && flow.fromElementId === selectedElement.id) ? (
            <p className="hint-text">This element has outgoing flows.</p>
          ) : null}
        </div>
      ) : editorMode === 'layout' ? (
        <p className="empty-state">Select an element on the canvas to edit it.</p>
      ) : null}
    </aside>
  );
}
