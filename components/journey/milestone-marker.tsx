'use client';

import { motion } from 'framer-motion';
import { Star, Trophy } from 'lucide-react';
import { JourneyEvent } from '@/lib/types/quest';
import { getQuestIcon } from '@/lib/utils/icon-map';

interface MilestoneMarkerProps {
  event: JourneyEvent;
}

export function MilestoneMarker({ event }: MilestoneMarkerProps) {
  const Icon = event.type === 'level-up' ? Trophy : getQuestIcon(event.questIcon);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative mx-auto max-w-md"
    >
      <div
        className="rounded-2xl border-2 p-4 text-center shadow-lg"
        style={{
          borderColor: event.questColor,
          background: `linear-gradient(135deg, ${event.questColor}10, ${event.questColor}25)`,
        }}
      >
        {/* Stars decoration */}
        <div className="flex justify-center gap-1 mb-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </motion.div>
          ))}
        </div>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
          style={{ backgroundColor: event.questColor + '30' }}
        >
          <Icon className="w-6 h-6" style={{ color: event.questColor }} />
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 dark:text-gray-100">
          {event.type === 'quest-complete'
            ? `"${event.questTitle}" 완료!`
            : `레벨 ${event.newLevel} 달성!`}
        </h3>

        {/* XP badge */}
        {event.xpEarned && (
          <span className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300">
            +{event.xpEarned} XP
          </span>
        )}
      </div>
    </motion.div>
  );
}
