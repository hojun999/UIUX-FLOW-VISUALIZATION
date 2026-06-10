export type EngineType = 'unity' | 'unreal' | 'godot' | 'custom';

export type UIScreenType = 'mainMenu' | 'hud' | 'pauseMenu' | 'inventory' | 'settings' | 'modal';

export type UIElementType = 'button' | 'text' | 'panel' | 'image' | 'slider' | 'healthBar' | 'minimap';

export type UIElement = {
  id: string;
  type: UIElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
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
  toScreenId: string;
  triggerElementId?: string;
  description: string;
};

export type GameUIProject = {
  id: string;
  name: string;
  engine: EngineType;
  screens: UIScreen[];
  flows: UIFlow[];
};
