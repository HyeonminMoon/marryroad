'use client';

import { useEffect, useCallback, useState } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  ConnectionMode, 
  Node, 
  Edge, 
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useQuestStore, calculateLevelProgress } from '@/lib/stores/quest-store';
import QuestNode from '@/components/quest/quest-node';
import { TaskModal } from '@/components/quest/task-modal';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { RotateCcw, Trophy, TrendingUp, Lock, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Quest } from '@/lib/types/quest';

// Custom Node Types
const nodeTypes: NodeTypes = {
  questNode: QuestNode,
};

export default function RoadmapPage() {
  const { 
    initialize, 
    getFlowNodes, 
    getFlowEdges, 
    progress,
    resetProgress,
  } = useQuestStore();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [lockedMessage, setLockedMessage] = useState<string | null>(null);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Sync nodes/edges from store
  useEffect(() => {
    const flowNodes = getFlowNodes();
    const flowEdges = getFlowEdges();
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [getFlowNodes, getFlowEdges, setNodes, setEdges, progress]);

  // Handle node click
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const quest = node.data as unknown as Quest;

    if (quest.status === 'locked') {
      // 선행 퀘스트 이름을 찾아서 안내
      const { quests } = useQuestStore.getState();
      const prereqNames = quest.dependencies
        .filter((depId: string) => !progress.completedQuestIds.includes(depId))
        .map((depId: string) => {
          const dep = quests.find((q: Quest) => q.id === depId);
          return dep ? `"${dep.title}"` : depId;
        });
      const message = prereqNames.length > 0
        ? `이 퀘스트를 시작하려면 ${prereqNames.join(', ')}을(를) 먼저 완료하세요.`
        : '이 퀘스트는 아직 잠겨 있습니다.';
      setLockedMessage(message);
      // 3초 후 자동 닫힘
      setTimeout(() => setLockedMessage(null), 3500);
      return;
    }

    setSelectedQuest(quest);
    setModalOpen(true);
  }, [progress.completedQuestIds]);

  // Handle node hover to highlight edges
  const onNodeMouseEnter = useCallback((event: React.MouseEvent, node: Node) => {
    setEdges(edges => 
      edges.map(edge => {
        const isConnected = edge.source === node.id || edge.target === node.id;
        return {
          ...edge,
          animated: isConnected,
          style: {
            ...edge.style,
            strokeWidth: isConnected ? 3 : 2,
            stroke: isConnected ? '#8B5CF6' : '#94a3b8',
            opacity: isConnected ? 1 : 0.3,
          },
        };
      })
    );
  }, [setEdges]);

  const onNodeMouseLeave = useCallback(() => {
    setEdges(edges =>
      edges.map(edge => ({
        ...edge,
        animated: false,
        style: {
          ...edge.style,
          strokeWidth: 2,
          stroke: '#94a3b8',
          opacity: 1,
        },
      }))
    );
  }, [setEdges]);

  const handleReset = useCallback(() => {
    setResetDialogOpen(true);
  }, []);

  const confirmReset = useCallback(() => {
    resetProgress();
    setResetDialogOpen(false);
  }, [resetProgress]);

  // Level up effect
  useEffect(() => {
    const prevLevel = parseInt(localStorage.getItem('prevLevel') || '1');
    if (progress.level > prevLevel) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      localStorage.setItem('prevLevel', progress.level.toString());
    }
  }, [progress.level]);

  const totalQuests = nodes.length;
  const completedQuests = progress.completedQuestIds.length;
  const overallProgress = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="flex-1 relative">
        {/* Stats Overlay */}
        <div className="absolute top-4 left-4 z-10 space-y-2">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-lg">레벨 {progress.level}</span>
            </div>
            {(() => {
              const lvlProgress = calculateLevelProgress(progress.xp);
              return (
                <>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    XP: {lvlProgress.currentLevelXp} / {lvlProgress.nextLevelXp}
                  </div>
                  <div className="mt-2 w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all"
                      style={{ width: `${lvlProgress.percent}%` }}
                    />
                  </div>
                </>
              );
            })()}
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className="font-bold">전체 진행률</span>
            </div>
            <div className="text-2xl font-bold mb-1">{overallProgress}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {completedQuests} / {totalQuests} 퀘스트
            </div>
            <div className="mt-2 w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all" 
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm font-semibold mb-1">예산</div>
            <div className="text-lg font-bold text-red-500">
              {progress.budget.spent.toLocaleString()}원
            </div>
            <div className="text-xs text-gray-500">
              / {progress.budget.total.toLocaleString()}원
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            초기화
          </Button>
        </div>

        {/* React Flow Canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Strict}
          fitView
          fitViewOptions={{ padding: 0.3, maxZoom: 0.9 }}
          minZoom={0.3}
          maxZoom={1.2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        >
          <Background color="#94a3b8" gap={20} size={1} />
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              const quest = node.data as unknown as Quest;
              return quest.color;
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
            position="bottom-right"
          />
        </ReactFlow>
      </div>

      {/* 잠긴 퀘스트 클릭 시 토스트 알림 */}
      {lockedMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-xl border border-gray-700 max-w-md">
            <Lock className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-sm">{lockedMessage}</p>
          </div>
        </div>
      )}

      {/* 초기화 확인 모달 */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              진행 상황 초기화
            </DialogTitle>
            <DialogDescription>
              정말 모든 진행 상황을 초기화하시겠습니까? 완료한 퀘스트, XP, 예산 기록이 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={confirmReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              초기화
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Modal */}
      <TaskModal
        quest={selectedQuest}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedQuest(null);
        }}
      />
    </div>
  );
}
