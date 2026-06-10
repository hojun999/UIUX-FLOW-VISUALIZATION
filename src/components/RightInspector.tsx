import type { UIElement, UIScreen, UIScreenType } from '../types';

const screenTypes: UIScreenType[] = ['mainMenu', 'hud', 'pauseMenu', 'inventory', 'settings', 'modal'];

type RightInspectorProps = {
  canDeleteScreen: boolean;
  selectedElement: UIElement | undefined;
  screen: UIScreen | undefined;
  onDeleteScreen: () => void;
  onDeleteElement: () => void;
  onUpdateElement: (patch: Partial<Omit<UIElement, 'id' | 'type'>>) => void;
  onUpdateScreenName: (name: string) => void;
  onUpdateScreenType: (type: UIScreenType) => void;
};

export function RightInspector({
  canDeleteScreen,
  selectedElement,
  screen,
  onDeleteScreen,
  onDeleteElement,
  onUpdateElement,
  onUpdateScreenName,
  onUpdateScreenType,
}: RightInspectorProps) {
  return (
    <aside className="right-inspector">
      <h2>Inspector</h2>
      {screen ? (
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
      ) : (
        <p className="empty-state">Select a screen to inspect it.</p>
      )}

      {selectedElement ? (
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
        </div>
      ) : (
        <p className="empty-state">Select an element on the canvas to edit it.</p>
      )}
    </aside>
  );
}
