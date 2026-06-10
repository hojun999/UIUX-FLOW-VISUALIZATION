import type { UIScreen } from '../types';

type RightInspectorProps = {
  screen: UIScreen | undefined;
};

export function RightInspector({ screen }: RightInspectorProps) {
  return (
    <aside className="right-inspector">
      <h2>Inspector</h2>
      {screen ? (
        <div className="inspector-panel">
          <dl>
            <div>
              <dt>Screen Name</dt>
              <dd>{screen.name}</dd>
            </div>
            <div>
              <dt>Screen Type</dt>
              <dd>{screen.type}</dd>
            </div>
            <div>
              <dt>Screen ID</dt>
              <dd>{screen.id}</dd>
            </div>
            <div>
              <dt>Elements</dt>
              <dd>{screen.elements.length}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <p className="empty-state">Select a screen to inspect it.</p>
      )}
    </aside>
  );
}
