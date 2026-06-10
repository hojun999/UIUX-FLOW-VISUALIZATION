import {
  Background,
  Controls,
  ReactFlow,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { UIFlow, UIScreen } from '../types';

type FlowEditorProps = {
  flows: UIFlow[];
  screens: UIScreen[];
  selectedFlowId: string | null;
  selectedScreenId: string;
  onCreateFlow: (fromScreenId: string, toScreenId: string) => void;
  onSelectFlow: (flowId: string | null) => void;
  onSelectScreen: (screenId: string) => void;
};

function getScreenPosition(index: number) {
  return {
    x: 80 + (index % 3) * 260,
    y: 80 + Math.floor(index / 3) * 170,
  };
}

function getSourceElementName(flow: UIFlow, screens: UIScreen[]): string | null {
  if (!flow.fromElementId) {
    return null;
  }

  const sourceScreen = screens.find((screen) => screen.id === flow.fromScreenId);
  const sourceElement = sourceScreen?.elements.find((element) => element.id === flow.fromElementId);

  return sourceElement?.name ?? null;
}

export function FlowEditor({
  flows,
  screens,
  selectedFlowId,
  selectedScreenId,
  onCreateFlow,
  onSelectFlow,
  onSelectScreen,
}: FlowEditorProps) {
  const nodes: Node[] = screens.map((screen, index) => ({
    id: screen.id,
    type: 'default',
    position: getScreenPosition(index),
    data: {
      label: (
        <div className="flow-node-label">
          <strong>{screen.name}</strong>
          <span>{screen.type}</span>
        </div>
      ),
    },
    selected: screen.id === selectedScreenId,
  }));

  const edges: Edge[] = flows.map((flow) => ({
    id: flow.id,
    source: flow.fromScreenId,
    target: flow.toScreenId,
    label: getSourceElementName(flow, screens) ?? flow.trigger ?? flow.description ?? 'Flow',
    selected: flow.id === selectedFlowId,
  }));

  function handleConnect(connection: Connection) {
    if (!connection.source || !connection.target || connection.source === connection.target) {
      return;
    }

    onCreateFlow(connection.source, connection.target);
  }

  return (
    <section className="flow-editor">
      <ReactFlow
        edges={edges}
        fitView
        nodes={nodes}
        onConnect={handleConnect}
        onEdgeClick={(_, edge) => onSelectFlow(edge.id)}
        onNodeClick={(_, node) => {
          onSelectScreen(node.id);
          onSelectFlow(null);
        }}
        onPaneClick={() => onSelectFlow(null)}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </section>
  );
}
