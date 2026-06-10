import type { UIScreen } from '../types';

type LeftSidebarProps = {
  screens: UIScreen[];
  selectedScreenId: string;
  onSelectScreen: (screenId: string) => void;
};

export function LeftSidebar({ screens, selectedScreenId, onSelectScreen }: LeftSidebarProps) {
  return (
    <aside className="left-sidebar">
      <h2>Screens</h2>
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
