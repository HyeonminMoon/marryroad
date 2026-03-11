'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, DollarSign, Star, Building2 } from 'lucide-react';
import { JourneyEvent } from '@/lib/types/quest';
import { getQuestIcon } from '@/lib/utils/icon-map';

interface JourneyCardProps {
  event: JourneyEvent;
  index: number;
  side: 'left' | 'right';
}

export function JourneyCard({ event, index, side }: JourneyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = getQuestIcon(event.questIcon);
  const hasDetails = event.memo || event.cost || event.vendorName || event.rating;

  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`relative max-w-sm w-full ${
        side === 'right' ? 'md:ml-auto' : ''
      }`}
    >
      <button
        onClick={() => hasDetails && setExpanded(!expanded)}
        className={`w-full text-left bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-xl border-2 p-4 shadow-sm transition-all ${
          hasDetails ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
        }`}
        style={{ borderColor: event.questColor + '40' }}
      >
        {/* Quest badge */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: event.questColor + '20' }}
          >
            <Icon className="w-4 h-4" style={{ color: event.questColor }} />
          </div>
          <span
            className="text-xs font-medium"
            style={{ color: event.questColor }}
          >
            {event.questTitle}
          </span>
          {hasDetails && (
            <ChevronDown
              className={`w-4 h-4 ml-auto text-gray-400 transition-transform ${
                expanded ? 'rotate-180' : ''
              }`}
            />
          )}
        </div>

        {/* Task title */}
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug">
          {event.taskTitle}
        </h4>

        {/* Memo preview (collapsed) */}
        {event.memo && !expanded && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
            {event.memo}
          </p>
        )}

        {/* Expanded details */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 space-y-2 border-t border-gray-100 dark:border-gray-800 pt-3"
          >
            {event.memo && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {event.memo}
              </p>
            )}
            {event.cost !== undefined && event.cost > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <DollarSign className="w-3.5 h-3.5" />
                <span>{event.cost.toLocaleString()}원</span>
              </div>
            )}
            {event.vendorName && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Building2 className="w-3.5 h-3.5" />
                <span>{event.vendorName}</span>
              </div>
            )}
            {event.rating && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < event.rating!
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
            {event.photos && event.photos.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {event.photos.map((photo, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden"
                  >
                    <img
                      src={photo}
                      alt={`${event.taskTitle} 사진 ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </button>
    </motion.div>
  );
}
