'use client';

import { useEffect, useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import QuestNode from './quest-node';
import { Quest } from '@/lib/types/quest';
import { useQuestStore } from '@/lib/stores/quest-store';

const nodeTypes = { questNode: QuestNode };

interface FullMapViewProps {
  onQuestClick: (quest: Quest) => void;
}

export function FullMapView({ onQuestClick }: FullMapViewProps) {
  const { getFlowNodes, getFlowEdges, progress } = useQuestStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    const flowNodes = getFlowNodes();
    const flowEdges = getFlowEdges();
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [getFlowNodes, getFlowEdges, setNodes, setEdges, progress]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const quest = node.data as Quest;
      onQuestClick(quest);
    },
    [onQuestClick]
  );

  return (
    <div className="w-full h-[calc(100vh-8rem)] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3, maxZoom: 0.9 }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        minZoom={0.3}
        maxZoom={1.2}
        proOptions={{ hideAttribution: true }}
      >
        <Controls position="bottom-right" />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
