'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Quest } from '@/lib/types/quest';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

const QuestNode = memo((props: NodeProps<Node<Quest>>) => {
  const quest = props.data;
  const Icon = (Icons as any)[quest.icon] || Icons.Circle;
  
  const getStatusStyle = () => {
    switch (quest.status) {
      case 'completed':
        return 'bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-400 shadow-lg shadow-green-500/50';
      case 'available':
        return 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-400 shadow-lg shadow-blue-500/50 hover:scale-105';
      case 'in-progress':
        return 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-400 shadow-lg shadow-amber-500/50';
      case 'locked':
      default:
        return 'bg-gray-800 text-gray-400 border-gray-700 opacity-60';
    }
  };
  
  const getLockIcon = () => {
    if (quest.status === 'locked') return <Icons.Lock className="w-5 h-5" />;
    if (quest.status === 'completed') return <Icons.CheckCircle className="w-5 h-5" />;
    return null;
  };
  
  return (
    <>
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-purple-500" />
      
      <motion.div
        className={`relative w-72 h-48 rounded-xl border-2 p-4 transition-all cursor-pointer ${getStatusStyle()}`}
        whileHover={quest.status === 'available' ? { scale: 1.05 } : {}}
        whileTap={quest.status === 'available' ? { scale: 0.98 } : {}}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold opacity-80">Quest {quest.id}</div>
          </div>
          {getLockIcon()}
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-bold mb-2 leading-tight line-clamp-2">
          {quest.title}
        </h3>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium">진행률</span>
            <span className="text-xs font-bold">{quest.progress || 0}%</span>
          </div>
          <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/90 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${quest.progress || 0}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
        
        {/* Task Count */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Icons.ListChecks className="w-4 h-4" />
            <span>{quest.tasks.length}개 작업</span>
          </div>
          <div className="flex items-center gap-1">
            <Icons.Sparkles className="w-4 h-4" />
            <span>+{quest.xp} XP</span>
          </div>
        </div>
        
        {/* Status Badge */}
        {quest.status === 'available' && (
          <motion.div
            className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            시작 가능!
          </motion.div>
        )}
      </motion.div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-purple-500" />
    </>
  );
});

QuestNode.displayName = 'QuestNode';

export default QuestNode;
