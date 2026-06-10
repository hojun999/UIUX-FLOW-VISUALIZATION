import { useMemo, useState } from 'react';
import { LeftSidebar } from './components/LeftSidebar';
import { RightInspector } from './components/RightInspector';
import { TopBar } from './components/TopBar';
import { Workspace } from './components/Workspace';
import { sampleProject } from './data/sampleProject';
import type { GameUIProject, UIElement, UIElementType, UIFlow, UIScreen, UIScreenType } from './types';

const elementLabels: Record<UIElementType, string> = {
  button: 'Button',
  text: 'Text',
  panel: 'Panel',
  image: 'Image',
  slider: 'Slider',
  toggle: 'Toggle',
  inventorySlot: 'Inventory Slot',
  healthBar: 'Health Bar',
  minimap: 'Minimap',
  custom: 'Custom',
};

const elementDefaults: Record<UIElementType, Pick<UIElement, 'width' | 'height'>> = {
  button: { width: 140, height: 44 },
  text: { width: 180, height: 36 },
  panel: { width: 240, height: 140 },
  image: { width: 120, height: 120 },
  slider: { width: 220, height: 36 },
  toggle: { width: 110, height: 36 },
  inventorySlot: { width: 64, height: 64 },
  healthBar: { width: 180, height: 28 },
  minimap: { width: 120, height: 120 },
  custom: { width: 140, height: 80 },
};

function createScreenId(): string {
  return `screen-${crypto.randomUUID()}`;
}

function createNewScreen(screenNumber: number): UIScreen {
  return {
    id: createScreenId(),
    name: `New Screen ${screenNumber}`,
    type: 'modal',
    elements: [],
  };
}

function createElementId(): string {
  return `element-${crypto.randomUUID()}`;
}

function createFlowId(): string {
  return `flow-${crypto.randomUUID()}`;
}

function createNewElement(type: UIElementType, elementNumber: number): UIElement {
  const label = elementLabels[type];
  const defaults = elementDefaults[type];

  return {
    id: createElementId(),
    type,
    name: `${label} ${elementNumber}`,
    label,
    x: 80 + ((elementNumber - 1) % 4) * 28,
    y: 80 + ((elementNumber - 1) % 4) * 28,
    width: defaults.width,
    height: defaults.height,
    description: '',
  };
}

function App() {
  const [project, setProject] = useState<GameUIProject>(sampleProject);
  const [editorMode, setEditorMode] = useState<'layout' | 'flow'>('layout');
  const [selectedScreenId, setSelectedScreenId] = useState(project.screens[0]?.id ?? '');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);

  const selectedScreen = useMemo(
    () => project.screens.find((screen) => screen.id === selectedScreenId),
    [project.screens, selectedScreenId],
  );

  const selectedElement = useMemo(
    () => selectedScreen?.elements.find((element) => element.id === selectedElementId),
    [selectedElementId, selectedScreen],
  );

  const selectedFlow = useMemo(
    () => project.flows.find((flow) => flow.id === selectedFlowId),
    [project.flows, selectedFlowId],
  );

  function selectScreen(screenId: string) {
    setSelectedScreenId(screenId);
    setSelectedElementId(null);
    setSelectedFlowId(null);
  }

  function addScreen() {
    const screen = createNewScreen(project.screens.length + 1);

    setProject((currentProject) => ({
      ...currentProject,
      screens: [...currentProject.screens, screen],
    }));
    setSelectedScreenId(screen.id);
    setSelectedElementId(null);
    setSelectedFlowId(null);
  }

  function updateSelectedScreenName(name: string) {
    setProject((currentProject) => ({
      ...currentProject,
      screens: currentProject.screens.map((screen) =>
        screen.id === selectedScreenId ? { ...screen, name } : screen,
      ),
    }));
  }

  function updateSelectedScreenType(type: UIScreenType) {
    setProject((currentProject) => ({
      ...currentProject,
      screens: currentProject.screens.map((screen) =>
        screen.id === selectedScreenId ? { ...screen, type } : screen,
      ),
    }));
  }

  function deleteSelectedScreen() {
    if (project.screens.length <= 1) {
      return;
    }

    const selectedIndex = project.screens.findIndex((screen) => screen.id === selectedScreenId);
    const nextScreens = project.screens.filter((screen) => screen.id !== selectedScreenId);
    const fallbackScreen = nextScreens[Math.max(0, selectedIndex - 1)] ?? nextScreens[0];

    setProject((currentProject) => ({
      ...currentProject,
      screens: nextScreens,
      flows: currentProject.flows.filter(
        (flow) => flow.fromScreenId !== selectedScreenId && flow.toScreenId !== selectedScreenId,
      ),
    }));
    setSelectedScreenId(fallbackScreen.id);
    setSelectedElementId(null);
    setSelectedFlowId(null);
  }

  function addElement(type: UIElementType) {
    if (!selectedScreen) {
      return;
    }

    const element = createNewElement(type, selectedScreen.elements.length + 1);

    setProject((currentProject) => ({
      ...currentProject,
      screens: currentProject.screens.map((screen) =>
        screen.id === selectedScreen.id ? { ...screen, elements: [...screen.elements, element] } : screen,
      ),
    }));
    setSelectedElementId(element.id);
    setSelectedFlowId(null);
  }

  function updateSelectedElement(patch: Partial<Omit<UIElement, 'id' | 'type'>>) {
    if (!selectedScreen || !selectedElement) {
      return;
    }

    setProject((currentProject) => ({
      ...currentProject,
      screens: currentProject.screens.map((screen) =>
        screen.id === selectedScreen.id
          ? {
              ...screen,
              elements: screen.elements.map((element) =>
                element.id === selectedElement.id ? { ...element, ...patch } : element,
              ),
            }
          : screen,
      ),
    }));
  }

  function moveElement(elementId: string, x: number, y: number) {
    if (!selectedScreen) {
      return;
    }

    setProject((currentProject) => ({
      ...currentProject,
      screens: currentProject.screens.map((screen) =>
        screen.id === selectedScreen.id
          ? {
              ...screen,
              elements: screen.elements.map((element) =>
                element.id === elementId ? { ...element, x, y } : element,
              ),
            }
          : screen,
      ),
    }));
  }

  function deleteSelectedElement() {
    if (!selectedScreen || !selectedElement) {
      return;
    }

    setProject((currentProject) => ({
      ...currentProject,
      screens: currentProject.screens.map((screen) =>
        screen.id === selectedScreen.id
          ? {
              ...screen,
              elements: screen.elements.filter((element) => element.id !== selectedElement.id),
            }
          : screen,
      ),
      flows: currentProject.flows.filter((flow) => flow.triggerElementId !== selectedElement.id),
    }));
    setSelectedElementId(null);
  }

  function createFlow(fromScreenId: string, toScreenId: string) {
    const fromScreen = project.screens.find((screen) => screen.id === fromScreenId);
    const toScreen = project.screens.find((screen) => screen.id === toScreenId);

    if (!fromScreen || !toScreen) {
      return;
    }

    const flow: UIFlow = {
      id: createFlowId(),
      fromScreenId,
      toScreenId,
      trigger: `${fromScreen.name} to ${toScreen.name}`,
      description: '',
      condition: '',
    };

    setProject((currentProject) => ({
      ...currentProject,
      flows: [...currentProject.flows, flow],
    }));
    setSelectedFlowId(flow.id);
    setSelectedElementId(null);
  }

  function updateSelectedFlow(patch: Partial<Pick<UIFlow, 'trigger' | 'description' | 'condition'>>) {
    if (!selectedFlow) {
      return;
    }

    setProject((currentProject) => ({
      ...currentProject,
      flows: currentProject.flows.map((flow) => (flow.id === selectedFlow.id ? { ...flow, ...patch } : flow)),
    }));
  }

  function deleteSelectedFlow() {
    if (!selectedFlow) {
      return;
    }

    setProject((currentProject) => ({
      ...currentProject,
      flows: currentProject.flows.filter((flow) => flow.id !== selectedFlow.id),
    }));
    setSelectedFlowId(null);
  }

  return (
    <main className="app-shell">
      <TopBar project={project} />
      <LeftSidebar
        screens={project.screens}
        selectedScreenId={selectedScreenId}
        onAddElement={addElement}
        onSelectScreen={selectScreen}
        onAddScreen={addScreen}
      />
      <Workspace
        editorMode={editorMode}
        flows={project.flows}
        screen={selectedScreen}
        screens={project.screens}
        selectedFlowId={selectedFlowId}
        selectedElementId={selectedElementId}
        selectedScreenId={selectedScreenId}
        onCreateFlow={createFlow}
        onMoveElement={moveElement}
        onSelectFlow={setSelectedFlowId}
        onSelectElement={setSelectedElementId}
        onSelectScreen={selectScreen}
      />
      <RightInspector
        canDeleteScreen={project.screens.length > 1}
        editorMode={editorMode}
        selectedFlow={selectedFlow}
        selectedElement={selectedElement}
        screen={selectedScreen}
        onDeleteScreen={deleteSelectedScreen}
        onDeleteElement={deleteSelectedElement}
        onDeleteFlow={deleteSelectedFlow}
        onSetEditorMode={(mode) => {
          setEditorMode(mode);
          setSelectedElementId(null);
          setSelectedFlowId(null);
        }}
        onUpdateElement={updateSelectedElement}
        onUpdateFlow={updateSelectedFlow}
        onUpdateScreenName={updateSelectedScreenName}
        onUpdateScreenType={updateSelectedScreenType}
      />
    </main>
  );
}

export default App;
