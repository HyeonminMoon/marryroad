'use client';

import { useState, useMemo } from 'react';
import { useGuestStore } from '@/lib/stores/guest-store';
import { Header } from '@/components/header';
import {
  Users, Plus, Search, Filter, UserCheck, UserX, Clock,
  Gift, Utensils, ChevronDown, Trash2, Pencil, X, Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Guest, GuestSide, GuestRelation, RsvpStatus, MealType } from '@/lib/types/guest';

const SIDE_LABELS: Record<GuestSide, string> = { groom: '신랑측', bride: '신부측', shared: '공통' };
const RELATION_LABELS: Record<GuestRelation, string> = { family: '가족', friend: '친구', work: '직장', other: '기타' };
const RSVP_LABELS: Record<RsvpStatus, { label: string; color: string; icon: typeof UserCheck }> = {
  confirmed: { label: '참석', color: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/30', icon: UserCheck },
  declined: { label: '불참', color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30', icon: UserX },
  pending: { label: '미정', color: 'text-gray-500 bg-gray-50 dark:text-gray-400 dark:bg-gray-800/50', icon: Clock },
  maybe: { label: '미정', color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30', icon: Clock },
};
const MEAL_LABELS: Record<MealType, string> = { standard: '일반식', vegetarian: '채식', none: '식사안함' };

function GuestForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Guest>;
  onSave: (data: Omit<Guest, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name || '');
  const [side, setSide] = useState<GuestSide>(initial?.side || 'groom');
  const [relation, setRelation] = useState<GuestRelation>(initial?.relation || 'friend');
  const [rsvp, setRsvp] = useState<RsvpStatus>(initial?.rsvp || 'pending');
  const [plusOne, setPlusOne] = useState(initial?.plusOne || false);
  const [meal, setMeal] = useState<MealType>(initial?.meal || 'standard');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [memo, setMemo] = useState(initial?.memo || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), side, relation, rsvp, plusOne, meal, phone: phone || undefined, memo: memo || undefined });
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-gray-700/50 p-4 shadow-sm overflow-hidden"
    >
      <div className="space-y-3">
        {/* Name */}
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
          className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 outline-none"
        />

        {/* Side + Relation */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 block">구분</label>
            <div className="flex gap-1">
              {(Object.keys(SIDE_LABELS) as GuestSide[]).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSide(s)}
                  className={`flex-1 text-[11px] py-1.5 rounded-lg transition-all ${
                    side === s
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {SIDE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 block">관계</label>
            <select
              value={relation}
              onChange={e => setRelation(e.target.value as GuestRelation)}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {(Object.keys(RELATION_LABELS) as GuestRelation[]).map(r => (
                <option key={r} value={r}>{RELATION_LABELS[r]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* RSVP + Meal */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 block">참석여부</label>
            <div className="flex gap-1">
              {(['confirmed', 'pending', 'declined'] as RsvpStatus[]).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRsvp(r)}
                  className={`flex-1 text-[11px] py-1.5 rounded-lg transition-all ${
                    rsvp === r
                      ? r === 'confirmed' ? 'bg-green-600 text-white'
                        : r === 'declined' ? 'bg-red-600 text-white'
                        : 'bg-gray-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {RSVP_LABELS[r].label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 block">식사</label>
            <select
              value={meal}
              onChange={e => setMeal(e.target.value as MealType)}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {(Object.keys(MEAL_LABELS) as MealType[]).map(m => (
                <option key={m} value={m}>{MEAL_LABELS[m]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Plus one + Phone */}
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={plusOne}
              onChange={e => setPlusOne(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            동반 1인 (+1)
          </label>
          <input
            type="tel"
            placeholder="연락처 (선택)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Memo */}
        <input
          type="text"
          placeholder="메모 (선택)"
          value={memo}
          onChange={e => setMemo(e.target.value)}
          className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!name.trim()}
            className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-purple-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            {initial ? '수정' : '추가'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </motion.form>
  );
}

export default function GuestsPage() {
  const { guests, addGuest, updateGuest, removeGuest, getStats } = useGuestStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterSide, setFilterSide] = useState<GuestSide | 'all'>('all');
  const [filterRsvp, setFilterRsvp] = useState<RsvpStatus | 'all'>('all');

  const stats = useMemo(() => getStats(), [guests]);

  const filteredGuests = useMemo(() => {
    let result = guests;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(g => g.name.toLowerCase().includes(q) || g.memo?.toLowerCase().includes(q));
    }
    if (filterSide !== 'all') result = result.filter(g => g.side === filterSide);
    if (filterRsvp !== 'all') result = result.filter(g => g.rsvp === filterRsvp);
    return result;
  }, [guests, search, filterSide, filterRsvp]);

  const formatAmount = (amount: number) => {
    if (amount >= 10000) return `${Math.round(amount / 10000).toLocaleString()}만`;
    return amount.toLocaleString();
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-xl border border-white/30 dark:border-gray-700/50 p-3 text-center">
            <Users className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
            <p className="text-[10px] text-gray-500">전체</p>
          </div>
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-xl border border-white/30 dark:border-gray-700/50 p-3 text-center">
            <UserCheck className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.confirmed}</p>
            <p className="text-[10px] text-gray-500">참석</p>
          </div>
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-xl border border-white/30 dark:border-gray-700/50 p-3 text-center">
            <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
            <p className="text-[10px] text-gray-500">미정</p>
          </div>
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-xl border border-white/30 dark:border-gray-700/50 p-3 text-center">
            <Gift className="w-5 h-5 text-pink-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-pink-600 dark:text-pink-400">{stats.totalGiftAmount > 0 ? formatAmount(stats.totalGiftAmount) : '-'}</p>
            <p className="text-[10px] text-gray-500">축의금</p>
          </div>
        </div>

        {/* Side balance bar */}
        {guests.length > 0 && (
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-xl border border-white/30 dark:border-gray-700/50 p-3 mb-6">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-blue-600 dark:text-blue-400 font-medium">신랑측 {stats.groomSide}명</span>
              <span className="text-pink-600 dark:text-pink-400 font-medium">신부측 {stats.brideSide}명</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${stats.total > 0 ? (stats.groomSide / (stats.groomSide + stats.brideSide || 1)) * 100 : 50}%` }}
              />
              <div className="h-full bg-pink-500 flex-1" />
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="이름 검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>
          <select
            value={filterSide}
            onChange={e => setFilterSide(e.target.value as GuestSide | 'all')}
            className="border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="all">전체</option>
            <option value="groom">신랑측</option>
            <option value="bride">신부측</option>
            <option value="shared">공통</option>
          </select>
          <select
            value={filterRsvp}
            onChange={e => setFilterRsvp(e.target.value as RsvpStatus | 'all')}
            className="border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="all">전체</option>
            <option value="confirmed">참석</option>
            <option value="pending">미정</option>
            <option value="declined">불참</option>
          </select>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); }}
            className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-xl text-xs font-medium hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            추가
          </button>
        </div>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {showForm && !editingId && (
            <div className="mb-4">
              <GuestForm
                onSave={data => { addGuest(data); setShowForm(false); }}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Guest List */}
        <div className="space-y-2">
          {filteredGuests.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              {guests.length === 0 ? (
                <>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    하객 명부를 만들어보세요
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    참석 인원, 식사 선택, 축의금까지<br />한눈에 관리할 수 있어요
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  검색 결과가 없습니다
                </p>
              )}
            </div>
          )}

          {filteredGuests.map((guest, idx) => {
            const rsvpConfig = RSVP_LABELS[guest.rsvp];
            const RsvpIcon = rsvpConfig.icon;
            const isEditing = editingId === guest.id;

            return (
              <motion.div
                key={guest.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <GuestForm
                      key="edit"
                      initial={guest}
                      onSave={data => { updateGuest(guest.id, data); setEditingId(null); }}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <motion.div
                      key="view"
                      className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-xl border border-white/30 dark:border-gray-700/50 p-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          guest.side === 'groom'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                            : guest.side === 'bride'
                            ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                        }`}>
                          {guest.name.charAt(0)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {guest.name}
                            </span>
                            {guest.plusOne && (
                              <span className="text-[10px] bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded">
                                +1
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-gray-400">{SIDE_LABELS[guest.side]}</span>
                            <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
                            <span className="text-[10px] text-gray-400">{RELATION_LABELS[guest.relation]}</span>
                            {guest.memo && (
                              <>
                                <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
                                <span className="text-[10px] text-gray-400 truncate">{guest.memo}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* RSVP badge */}
                        <span className={`text-[11px] font-medium px-2 py-1 rounded-lg flex items-center gap-1 flex-shrink-0 ${rsvpConfig.color}`}>
                          <RsvpIcon className="w-3 h-3" />
                          {rsvpConfig.label}
                        </span>

                        {/* Actions */}
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => setEditingId(guest.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeGuest(guest.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Meal summary */}
        {stats.confirmed > 0 && (
          <div className="mt-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-xl border border-white/30 dark:border-gray-700/50 p-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
              <Utensils className="w-4 h-4 text-orange-500" />
              식사 현황 (참석 확정)
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.mealCounts.standard}</p>
                <p className="text-[10px] text-gray-500">일반식</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.mealCounts.vegetarian}</p>
                <p className="text-[10px] text-gray-500">채식</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-400">{stats.mealCounts.none}</p>
                <p className="text-[10px] text-gray-500">식사안함</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
