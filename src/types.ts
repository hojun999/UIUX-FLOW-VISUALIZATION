export type EngineType = 'unity' | 'unreal' | 'godot' | 'custom';

export type UIScreenType = 'mainMenu' | 'hud' | 'pauseMenu' | 'inventory' | 'settings' | 'modal';

export type UIElementType =
  | 'button'
  | 'text'
  | 'panel'
  | 'image'
  | 'slider'
  | 'toggle'
  | 'inventorySlot'
  | 'healthBar'
  | 'minimap'
  | 'custom';

export type UIElement = {
  id: string;
  type: UIElementType;
  name: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
};

export type UIScreen = {
  id: string;
  name: string;
  type: UIScreenType;
  elements: UIElement[];
};

export type UIFlow = {
  id: string;
  fromScreenId: string;
  fromElementId?: string;
  toScreenId: string;
  trigger: string;
  description: string;
  condition: string;
};

export type GameUIProject = {
  id: string;
  name: string;
  engine: EngineType;
  screens: UIScreen[];
  flows: UIFlow[];
};
