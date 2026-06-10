import type { GameUIProject } from '../types';

type TopBarProps = {
  project: GameUIProject;
};

export function TopBar({ project }: TopBarProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Game UI/UX Flow Designer</p>
        <h1>{project.name}</h1>
      </div>
      <div className="project-meta">
        <span>{project.engine}</span>
        <span>{project.screens.length} screens</span>
      </div>
    </header>
  );
}
