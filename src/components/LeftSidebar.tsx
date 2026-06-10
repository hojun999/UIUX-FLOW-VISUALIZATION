import type { UIScreen } from '../types';

type LeftSidebarProps = {
  screens: UIScreen[];
  selectedScreenId: string;
  onAddScreen: () => void;
  onSelectScreen: (screenId: string) => void;
};

export function LeftSidebar({ screens, selectedScreenId, onAddScreen, onSelectScreen }: LeftSidebarProps) {
  return (
    <aside className="left-sidebar">
      <div className="sidebar-heading">
        <h2>Screens</h2>
        <button className="add-screen-button" type="button" onClick={onAddScreen}>
          Add
        </button>
      </div>
      <div className="screen-list">
        {screens.map((screen) => (
          <button
            className={screen.id === selectedScreenId ? 'screen-item active' : 'screen-item'}
            key={screen.id}
            type="button"
            onClick={() => onSelectScreen(screen.id)}
          >
            <span>{screen.name}</span>
            <small>{screen.type}</small>
          </button>
        ))}
      </div>
    </aside>
  );
}
