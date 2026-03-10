'use client';

import { useMemo } from 'react';
import { Quest, QuestProgress } from '@/lib/types/quest';
import { getQuestIcon } from '@/lib/utils/icon-map';
import { Building2, DollarSign, Phone, Globe, MapPin, Star, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface VendorCard {
  taskId: string;
  taskTitle: string;
  questId: string;
  questTitle: string;
  questColor: string;
  questIcon: string;
  vendorName: string;
  vendorContact?: string;
  vendorWebsite?: string;
  vendorAddress?: string;
  cost?: number;
  rating?: number;
}

interface VendorCompareProps {
  quests: Quest[];
  progress: QuestProgress;
}

export function VendorCompare({ quests, progress }: VendorCompareProps) {
  const vendors = useMemo(() => {
    const cards: VendorCard[] = [];

    quests.forEach(quest => {
      const qp = progress.taskProgress[quest.id];
      if (!qp) return;

      quest.tasks.forEach(task => {
        const ext = qp.taskExtendedData?.[task.id];
        if (!ext?.vendorInfo?.name) return;

        cards.push({
          taskId: task.id,
          taskTitle: task.title,
          questId: quest.id,
          questTitle: quest.title,
          questColor: quest.color,
          questIcon: quest.icon,
          vendorName: ext.vendorInfo.name,
          vendorContact: ext.vendorInfo.contact,
          vendorWebsite: ext.vendorInfo.website,
          vendorAddress: ext.vendorInfo.address,
          cost: qp.taskCosts[task.id],
          rating: ext.rating,
        });
      });
    });

    return cards;
  }, [quests, progress]);

  if (vendors.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="w-4 h-4 text-purple-500" />
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
          내 업체 목록
        </h3>
        <span className="text-xs text-gray-400">{vendors.length}곳</span>
      </div>

      {/* Horizontal scroll cards */}
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {vendors.map((vendor, idx) => {
          const Icon = getQuestIcon(vendor.questIcon);
          return (
            <motion.div
              key={`${vendor.questId}-${vendor.taskId}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.06 }}
              className="flex-shrink-0 w-64 snap-start bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-gray-700/50 overflow-hidden shadow-sm"
            >
              {/* Color bar */}
              <div
                className="h-1.5"
                style={{ backgroundColor: vendor.questColor }}
              />

              <div className="p-4">
                {/* Quest badge */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: vendor.questColor + '20' }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: vendor.questColor }} />
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate">
                    {vendor.questTitle}
                  </span>
                </div>

                {/* Vendor name */}
                <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {vendor.vendorName}
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3 truncate">
                  {vendor.taskTitle}
                </p>

                {/* Details */}
                <div className="space-y-1.5">
                  {vendor.cost !== undefined && vendor.cost > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                      <DollarSign className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      <span className="font-semibold">{vendor.cost.toLocaleString()}원</span>
                    </div>
                  )}
                  {vendor.rating && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < vendor.rating!
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-200 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  {vendor.vendorContact && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Phone className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{vendor.vendorContact}</span>
                    </div>
                  )}
                  {vendor.vendorAddress && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{vendor.vendorAddress}</span>
                    </div>
                  )}
                  {vendor.vendorWebsite && (
                    <a
                      href={vendor.vendorWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-purple-500 hover:text-purple-600 transition-colors"
                    >
                      <Globe className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{vendor.vendorWebsite}</span>
                      <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
