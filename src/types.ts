export type UIElementType =
  | 'button'
  | 'text'
  | 'panel'
  | 'slider'
  | 'inventorySlot'
  | 'minimap'
  | 'healthBar';

export type UIElement = {
  id: string;
  type: UIElementType;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type UIScreen = {
  id: string;
  name: string;
  elements: UIElement[];
};

export type FlowConnection = {
  id: string;
  fromScreenId: string;
  fromElementId?: string;
  toScreenId: string;
  label: string;
};

export type FlowProject = {
  name: string;
  screens: UIScreen[];
  flows: FlowConnection[];
};
