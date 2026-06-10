import { useEffect, useMemo, useState } from 'react';
import { loadProject, saveProject } from './storage';
import type { FlowConnection, FlowProject, UIElement, UIElementType, UIScreen } from './types';

const elementLabels: Record<UIElementType, string> = {
  button: 'Button',
  text: 'Text',
  panel: 'Panel',
  slider: 'Slider',
  inventorySlot: 'Inventory Slot',
  minimap: 'Minimap',
  healthBar: 'Health Bar',
};

const elementDefaults: Record<UIElementType, Pick<UIElement, 'width' | 'height'>> = {
  button: { width: 120, height: 44 },
  text: { width: 160, height: 32 },
  panel: { width: 220, height: 140 },
  slider: { width: 180, height: 36 },
  inventorySlot: { width: 64, height: 64 },
  minimap: { width: 120, height: 120 },
  healthBar: { width: 180, height: 28 },
};

const starterProject: FlowProject = {
  name: 'New Game UI Flow',
  screens: [
    {
      id: 'screen-main-menu',
      name: 'Main Menu',
      elements: [
        {
          id: 'element-start-button',
          type: 'button',
          label: 'Start Game',
          x: 330,
          y: 250,
          width: 140,
          height: 48,
        },
      ],
    },
    {
      id: 'screen-hud',
      name: 'Gameplay HUD',
      elements: [
        {
          id: 'element-health',
          type: 'healthBar',
          label: 'HP',
          x: 32,
          y: 32,
          width: 180,
          height: 28,
        },
        {
          id: 'element-minimap',
          type: 'minimap',
          label: 'Map',
          x: 648,
          y: 24,
          width: 120,
          height: 120,
        },
      ],
    },
  ],
  flows: [
    {
      id: 'flow-start-game',
      fromScreenId: 'screen-main-menu',
      fromElementId: 'element-start-button',
      toScreenId: 'screen-hud',
      label: 'Start Game',
    },
  ],
};

function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function App() {
  const [project, setProject] = useState<FlowProject>(() => loadProject() ?? starterProject);
  const [selectedScreenId, setSelectedScreenId] = useState(project.screens[0]?.id ?? '');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [importValue, setImportValue] = useState('');

  const selectedScreen = useMemo(
    () => project.screens.find((screen) => screen.id === selectedScreenId) ?? project.screens[0],
    [project.screens, selectedScreenId],
  );

  const selectedElement = selectedScreen?.elements.find((element) => element.id === selectedElementId) ?? null;

  useEffect(() => {
    saveProject(project);
  }, [project]);

  function updateProject(updater: (current: FlowProject) => FlowProject) {
    setProject((current) => updater(current));
  }

  function addScreen() {
    const screen: UIScreen = {
      id: createId('screen'),
      name: `Screen ${project.screens.length + 1}`,
      elements: [],
    };

    updateProject((current) => ({
      ...current,
      screens: [...current.screens, screen],
    }));
    setSelectedScreenId(screen.id);
    setSelectedElementId(null);
  }

  function addElement(type: UIElementType) {
    if (!selectedScreen) {
      return;
    }

    const defaults = elementDefaults[type];
    const element: UIElement = {
      id: createId('element'),
      type,
      label: elementLabels[type],
      x: 80,
      y: 80,
      width: defaults.width,
      height: defaults.height,
    };

    updateProject((current) => ({
      ...current,
      screens: current.screens.map((screen) =>
        screen.id === selectedScreen.id ? { ...screen, elements: [...screen.elements, element] } : screen,
      ),
    }));
    setSelectedElementId(element.id);
  }

  function updateSelectedElement(patch: Partial<UIElement>) {
    if (!selectedScreen || !selectedElement) {
      return;
    }

    updateProject((current) => ({
      ...current,
      screens: current.screens.map((screen) =>
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

  function addFlow(toScreenId: string) {
    if (!selectedScreen || !toScreenId || selectedScreen.id === toScreenId) {
      return;
    }

    const flow: FlowConnection = {
      id: createId('flow'),
      fromScreenId: selectedScreen.id,
      fromElementId: selectedElement?.id,
      toScreenId,
      label: selectedElement ? `${selectedElement.label} -> ${screenName(toScreenId)}` : `${selectedScreen.name} -> ${screenName(toScreenId)}`,
    };

    updateProject((current) => ({
      ...current,
      flows: [...current.flows, flow],
    }));
  }

  function screenName(screenId: string) {
    return project.screens.find((screen) => screen.id === screenId)?.name ?? 'Unknown';
  }

  function exportJson() {
    setImportValue(JSON.stringify(project, null, 2));
  }

  function importJson() {
    try {
      const nextProject = JSON.parse(importValue) as FlowProject;
      if (!Array.isArray(nextProject.screens) || !Array.isArray(nextProject.flows)) {
        return;
      }

      setProject(nextProject);
      setSelectedScreenId(nextProject.screens[0]?.id ?? '');
      setSelectedElementId(null);
    } catch {
      return;
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <label className="field-label" htmlFor="project-name">
            Project
          </label>
          <input
            id="project-name"
            value={project.name}
            onChange={(event) => updateProject((current) => ({ ...current, name: event.target.value }))}
          />
        </div>

        <section>
          <div className="section-heading">
            <h2>Screens</h2>
            <button type="button" onClick={addScreen}>
              Add
            </button>
          </div>
          <div className="screen-list">
            {project.screens.map((screen) => (
              <button
                className={screen.id === selectedScreen?.id ? 'screen-item active' : 'screen-item'}
                key={screen.id}
                type="button"
                onClick={() => {
                  setSelectedScreenId(screen.id);
                  setSelectedElementId(null);
                }}
              >
                {screen.name}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2>Elements</h2>
          <div className="element-palette">
            {(Object.keys(elementLabels) as UIElementType[]).map((type) => (
              <button key={type} type="button" onClick={() => addElement(type)}>
                {elementLabels[type]}
              </button>
            ))}
          </div>
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <h1>{selectedScreen?.name ?? 'No Screen'}</h1>
            <p>{mode === 'edit' ? 'Layout editing' : 'Preview mode'}</p>
          </div>
          <div className="mode-toggle">
            <button className={mode === 'edit' ? 'active' : ''} type="button" onClick={() => setMode('edit')}>
              Edit
            </button>
            <button className={mode === 'preview' ? 'active' : ''} type="button" onClick={() => setMode('preview')}>
              Preview
            </button>
          </div>
        </header>

        <div className="canvas-wrap">
          <div className={mode === 'preview' ? 'canvas preview' : 'canvas'}>
            {selectedScreen?.elements.map((element) => (
              <button
                className={`ui-element ${element.type} ${selectedElementId === element.id ? 'selected' : ''}`}
                key={element.id}
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                }}
                type="button"
                onClick={() => setSelectedElementId(element.id)}
              >
                {element.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <aside className="inspector">
        <section>
          <h2>Inspector</h2>
          {selectedScreen ? (
            <label className="field-label" htmlFor="screen-name">
              Screen Name
              <input
                id="screen-name"
                value={selectedScreen.name}
                onChange={(event) =>
                  updateProject((current) => ({
                    ...current,
                    screens: current.screens.map((screen) =>
                      screen.id === selectedScreen.id ? { ...screen, name: event.target.value } : screen,
                    ),
                  }))
                }
              />
            </label>
          ) : null}

          {selectedElement ? (
            <div className="property-grid">
              <label>
                Label
                <input value={selectedElement.label} onChange={(event) => updateSelectedElement({ label: event.target.value })} />
              </label>
              <label>
                X
                <input type="number" value={selectedElement.x} onChange={(event) => updateSelectedElement({ x: Number(event.target.value) })} />
              </label>
              <label>
                Y
                <input type="number" value={selectedElement.y} onChange={(event) => updateSelectedElement({ y: Number(event.target.value) })} />
              </label>
              <label>
                W
                <input type="number" value={selectedElement.width} onChange={(event) => updateSelectedElement({ width: Number(event.target.value) })} />
              </label>
              <label>
                H
                <input type="number" value={selectedElement.height} onChange={(event) => updateSelectedElement({ height: Number(event.target.value) })} />
              </label>
            </div>
          ) : (
            <p className="empty-state">Select an element to edit its layout.</p>
          )}
        </section>

        <section>
          <h2>Flow</h2>
          <select defaultValue="" onChange={(event) => addFlow(event.target.value)}>
            <option value="" disabled>
              Connect to screen
            </option>
            {project.screens
              .filter((screen) => screen.id !== selectedScreen?.id)
              .map((screen) => (
                <option key={screen.id} value={screen.id}>
                  {screen.name}
                </option>
              ))}
          </select>
          <div className="flow-list">
            {project.flows.map((flow) => (
              <div className="flow-item" key={flow.id}>
                <strong>{screenName(flow.fromScreenId)}</strong>
                <span>{flow.label}</span>
                <strong>{screenName(flow.toScreenId)}</strong>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="section-heading">
            <h2>JSON</h2>
            <div className="inline-actions">
              <button type="button" onClick={exportJson}>
                Export
              </button>
              <button type="button" onClick={importJson}>
                Import
              </button>
            </div>
          </div>
          <textarea value={importValue} onChange={(event) => setImportValue(event.target.value)} spellCheck={false} />
        </section>
      </aside>
    </main>
  );
}

export default App;
