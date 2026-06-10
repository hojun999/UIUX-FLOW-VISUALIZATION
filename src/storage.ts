import type { FlowProject } from './types';

const STORAGE_KEY = 'game-uiux-flow-designer-project';

export function loadProject(): FlowProject | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as FlowProject;
  } catch {
    return null;
  }
}

export function saveProject(project: FlowProject): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
}
