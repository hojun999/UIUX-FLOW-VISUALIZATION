import type { UIScreen, UIScreenType } from '../types';

const screenTypes: UIScreenType[] = ['mainMenu', 'hud', 'pauseMenu', 'inventory', 'settings', 'modal'];

type RightInspectorProps = {
  canDeleteScreen: boolean;
  screen: UIScreen | undefined;
  onDeleteScreen: () => void;
  onUpdateScreenName: (name: string) => void;
  onUpdateScreenType: (type: UIScreenType) => void;
};

export function RightInspector({
  canDeleteScreen,
  screen,
  onDeleteScreen,
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
    </aside>
  );
}
