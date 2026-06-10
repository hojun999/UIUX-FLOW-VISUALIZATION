import { useMemo, useState } from 'react';
import { LeftSidebar } from './components/LeftSidebar';
import { RightInspector } from './components/RightInspector';
import { TopBar } from './components/TopBar';
import { Workspace } from './components/Workspace';
import { sampleProject } from './data/sampleProject';
import type { GameUIProject, UIScreen, UIScreenType } from './types';

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

function App() {
  const [project, setProject] = useState<GameUIProject>(sampleProject);
  const [selectedScreenId, setSelectedScreenId] = useState(project.screens[0]?.id ?? '');

  const selectedScreen = useMemo(
    () => project.screens.find((screen) => screen.id === selectedScreenId),
    [project.screens, selectedScreenId],
  );

  function addScreen() {
    const screen = createNewScreen(project.screens.length + 1);

    setProject((currentProject) => ({
      ...currentProject,
      screens: [...currentProject.screens, screen],
    }));
    setSelectedScreenId(screen.id);
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
  }

  return (
    <main className="app-shell">
      <TopBar project={project} />
      <LeftSidebar
        screens={project.screens}
        selectedScreenId={selectedScreenId}
        onSelectScreen={setSelectedScreenId}
        onAddScreen={addScreen}
      />
      <Workspace screen={selectedScreen} />
      <RightInspector
        canDeleteScreen={project.screens.length > 1}
        screen={selectedScreen}
        onDeleteScreen={deleteSelectedScreen}
        onUpdateScreenName={updateSelectedScreenName}
        onUpdateScreenType={updateSelectedScreenType}
      />
    </main>
  );
}

export default App;
