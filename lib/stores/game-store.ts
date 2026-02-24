import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Stage, Dependency, GameNode, UserProgress, NodeStatus } from '../types/marryroad';
import stagesData from '../data/stages.json';
import dependenciesData from '../data/dependencies.json';
import { Edge, Node } from '@xyflow/react';
import dagre from 'dagre';

// Type assertion for imported JSON
const STAGES = stagesData as Stage[];
const DEPENDENCIES = dependenciesData as Dependency[];

interface GameStore {
  // Data
  nodes: GameNode[];
  edges: Dependency[];
  
  // Progress
  progress: UserProgress;
  
  // Actions
  initialize: () => void;
  completeNode: (nodeId: string) => void;
  skipNode: (nodeId: string) => void;
  resetProgress: () => void;
  
  // Graph Logic
  getUnlockStatus: (nodeId: string) => NodeStatus;
  
  // Graph Editing
  addNode: (node: GameNode) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: Dependency) => void;
  removeEdge: (edgeId: string) => void;
  onNodesChange: (changes: unknown) => void; // Sync position changes
  
  // React Flow Adapter
  getFlowNodes: () => Node[];
  getFlowEdges: () => Edge[];
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      progress: {
        completedStageIds: [],
        skippedStageIds: [],
        xp: 0,
        level: 1,
        budget: {
          total: 30000000,
          spent: 0,
        },
      },

      initialize: () => {
        const { progress } = get();
        
        // Use Dagre for auto-layout
        const g = new dagre.graphlib.Graph();
        g.setGraph({ rankdir: 'LR', ranksep: 200, nodesep: 50 }); // Left-to-Right layout
        g.setDefaultEdgeLabel(() => ({}));

        // Add nodes to dagre
        STAGES.forEach(stage => {
            g.setNode(stage.id, { width: 200, height: 100 }); // Width/Height matches SkillTreeNode dimensions
        });

        // Add edges to dagre
        DEPENDENCIES.forEach(dep => {
            g.setEdge(dep.source, dep.target);
        });

        // Calculate layout
        dagre.layout(g);

        // Map Stages to GameNodes with Dagre positions
        const initialNodes: GameNode[] = STAGES.map(stage => {
          const { edges } = get();
        const status = calculateNodeStatus(stage.id, progress.completedStageIds, progress.skippedStageIds, edges);
          
          // Get position from Dagre
          const nodeWithPos = g.node(stage.id);
          
          // Calculate depth (tier) from x position for visualization logic if needed
          // or rely on Dagre's rank if we extracted it, but x-coord is fine proxy
          const depth = Math.floor(nodeWithPos.x / 300); 

          return {
            ...stage,
            position: { 
                x: nodeWithPos.x - 100, // Center offset
                y: nodeWithPos.y - 50 
            },
            status,
            isUnlockable: status === 'available',
            depth,
          };
        });

        set({
          nodes: initialNodes,
          edges: DEPENDENCIES,
        });
      },

      completeNode: (nodeId) => {
        const { progress, nodes } = get();
        if (progress.completedStageIds.includes(nodeId)) return;

        const newCompleted = [...progress.completedStageIds, nodeId];
        
        // Calculate XP (Simple: 100 XP per node)
        const newXp = progress.xp + 100;
        const newLevel = Math.floor(newXp / 1000) + 1;

        const newProgress = {
          ...progress,
          completedStageIds: newCompleted,
          xp: newXp,
          level: newLevel,
        };

        const { edges } = get();
        // Re-calculate statuses for all nodes
        const updatedNodes = nodes.map(node => ({
          ...node,
          status: calculateNodeStatus(node.id, newCompleted, progress.skippedStageIds, edges),
          isUnlockable: calculateNodeStatus(node.id, newCompleted, progress.skippedStageIds, edges) === 'available',
        }));

        set({
          progress: newProgress,
          nodes: updatedNodes,
        });
      },

      skipNode: (nodeId) => {
         const { progress, nodes } = get();
        if (progress.skippedStageIds.includes(nodeId)) return;

        const newSkipped = [...progress.skippedStageIds, nodeId];
        
        const newProgress = {
          ...progress,
          skippedStageIds: newSkipped,
        };

        const { edges } = get();
        const updatedNodes = nodes.map(node => ({
          ...node,
          status: calculateNodeStatus(node.id, progress.completedStageIds, newSkipped, edges),
          isUnlockable: calculateNodeStatus(node.id, progress.completedStageIds, newSkipped, edges) === 'available',
        }));

        set({
          progress: newProgress,
          nodes: updatedNodes,
        });
      },

      resetProgress: () => {
        set({
          progress: {
            completedStageIds: [],
            skippedStageIds: [],
            xp: 0,
            level: 1,
            budget: { total: 30000000, spent: 0 },
          },
        });
        
        const { edges } = get();
        // Re-calculate statuses for all nodes
        const { nodes: currentNodes } = get();
        const updatedNodes = currentNodes.map(node => ({
           ...node,
           status: calculateNodeStatus(node.id, [], [], edges),
           isUnlockable: calculateNodeStatus(node.id, [], [], edges) === 'available',
        }));
        set({ nodes: updatedNodes });
      },

      addNode: (node: GameNode) => {
          const { nodes } = get();
          set({ nodes: [...nodes, node] });
      },

      removeNode: (nodeId: string) => {
          const { nodes, edges } = get();
          set({
              nodes: nodes.filter(n => n.id !== nodeId),
              edges: edges.filter(e => e.source !== nodeId && e.target !== nodeId)
          });
      },

      addEdge: (edge: Dependency) => {
          const { edges, nodes } = get();
          
          // 1. Prevent Duplicates
          if (edges.some(e => e.source === edge.source && e.target === edge.target)) return;

          // 2. Prevent Cycles (Simple Check)
          // A full cycle check is O(V+E), might be heavy but necessary.
          // For now, let's just prevent direct self-loop
          if (edge.source === edge.target) return;

          const newEdges = [...edges, edge];
          
          // 3. Re-calculate Statuses (Target node might become locked)
          const updatedNodes = nodes.map(node => ({
              ...node,
              status: calculateNodeStatus(node.id, get().progress.completedStageIds, get().progress.skippedStageIds, newEdges),
              isUnlockable: calculateNodeStatus(node.id, get().progress.completedStageIds, get().progress.skippedStageIds, newEdges) === 'available',
          }));

          set({ edges: newEdges, nodes: updatedNodes });
      },

      removeEdge: (edgeId: string) => {
          // edgeId is typically source-target
          const { edges, nodes } = get();
          // Assuming edgeId is `source-target`
          const newEdges = edges.filter(e => `${e.source}-${e.target}` !== edgeId);
          
          // Re-calculate Statuses (Target node might become available)
          const updatedNodes = nodes.map(node => ({
              ...node,
              status: calculateNodeStatus(node.id, get().progress.completedStageIds, get().progress.skippedStageIds, newEdges),
              isUnlockable: calculateNodeStatus(node.id, get().progress.completedStageIds, get().progress.skippedStageIds, newEdges) === 'available',
          }));

          set({
              edges: newEdges,
              nodes: updatedNodes
          });
      },

      onNodesChange: (changes: unknown) => {
          // Placeholder for handling node changes (position updates, etc)
      },

      getUnlockStatus: (nodeId) => {
        const { progress, edges } = get();
        return calculateNodeStatus(nodeId, progress.completedStageIds, progress.skippedStageIds, edges);
      },
      
      getFlowNodes: () => {
        const { nodes } = get();
        // Convert GameNodes to React Flow Nodes
        return nodes.map(node => ({
            id: node.id,
            position: node.position,
            data: { ...node },
            type: 'skillNode' // Custom node type we will create
        }));
      },
      
      getFlowEdges: () => {
          const { edges, progress } = get();
          return edges.map(edge => {
             const isSourceCompleted = progress.completedStageIds.includes(edge.source);
             
             return {
                 id: `${edge.source}-${edge.target}`,
                 source: edge.source,
                 target: edge.target,
                 animated: isSourceCompleted && !progress.completedStageIds.includes(edge.target),
                 style: {
                     stroke: isSourceCompleted ? '#10b981' : '#94a3b8',
                     strokeWidth: 2
                 }
             }
          });
      }
    }),
    {
      name: 'marryroad-game-storage',
    }
  )
);

// Helper: Calculate status based on dependencies
function calculateNodeStatus(
  nodeId: string, 
  completedIds: string[], 
  skippedIds: string[],
  currentEdges?: Dependency[] // Optional, but if provided, it's authoritative
): NodeStatus {
  if (completedIds.includes(nodeId)) return 'completed';
  if (skippedIds.includes(nodeId)) return 'skipped';

  // If currentEdges is passed (even empty array), use it. Only use DEPENDENCIES if undefined.
  const edgesToUse = currentEdges !== undefined ? currentEdges : DEPENDENCIES;
  const prerequisites = edgesToUse.filter(d => d.target === nodeId);
  
  if (prerequisites.length === 0) return 'available'; // No dependencies

  const allPrereqsMet = prerequisites.every(req => {
      // Required dependency must be completed or skipped
      // Optional dependency... currently treated same for simplicity, logic can be refined
      return completedIds.includes(req.source) || skippedIds.includes(req.source);
  });

  return allPrereqsMet ? 'available' : 'locked';
}
