import type { GameUIProject } from './types';

const STORAGE_KEY = 'game-uiux-flow-designer-project';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isValidProject(value: unknown): value is GameUIProject {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    Array.isArray(value.screens) &&
    Array.isArray(value.flows)
  );
}

export function loadProject(): GameUIProject | null {
  try {
    const rawProject = localStorage.getItem(STORAGE_KEY);

    if (!rawProject) {
      return null;
    }

    const parsedProject = JSON.parse(rawProject);
    return isValidProject(parsedProject) ? parsedProject : null;
  } catch {
    return null;
  }
}

export function saveProject(project: GameUIProject): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  } catch {
    return;
  }
}

export function clearSavedProject(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
}
