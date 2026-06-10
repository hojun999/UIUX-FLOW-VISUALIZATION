import type { UIElementType, UIScreen } from '../types';

const elementTypes: UIElementType[] = [
  'button',
  'text',
  'panel',
  'image',
  'slider',
  'toggle',
  'inventorySlot',
  'healthBar',
  'minimap',
  'custom',
];

type LeftSidebarProps = {
  screens: UIScreen[];
  selectedScreenId: string;
  onAddElement: (type: UIElementType) => void;
  onAddScreen: () => void;
  onSelectScreen: (screenId: string) => void;
};

export function LeftSidebar({
  screens,
  selectedScreenId,
  onAddElement,
  onAddScreen,
  onSelectScreen,
}: LeftSidebarProps) {
  return (
    <aside className="left-sidebar">
      <section>
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
      </section>

      <section>
        <h2>Element Palette</h2>
        <div className="element-palette">
          {elementTypes.map((type) => (
            <button key={type} type="button" onClick={() => onAddElement(type)}>
              {type}
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}
