import { useMemo, useState } from 'react';
import { LeftSidebar } from './components/LeftSidebar';
import { RightInspector } from './components/RightInspector';
import { TopBar } from './components/TopBar';
import { Workspace } from './components/Workspace';
import { sampleProject } from './data/sampleProject';

function App() {
  const [selectedScreenId, setSelectedScreenId] = useState(sampleProject.screens[0]?.id ?? '');

  const selectedScreen = useMemo(
    () => sampleProject.screens.find((screen) => screen.id === selectedScreenId),
    [selectedScreenId],
  );

  return (
    <main className="app-shell">
      <TopBar project={sampleProject} />
      <LeftSidebar
        screens={sampleProject.screens}
        selectedScreenId={selectedScreenId}
        onSelectScreen={setSelectedScreenId}
      />
      <Workspace screen={selectedScreen} />
      <RightInspector screen={selectedScreen} />
    </main>
  );
}

export default App;
