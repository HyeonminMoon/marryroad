# Cycle 55 — Design Spec
- QuestProgress.hiddenQuestIds: string[]
- toggleHideQuest(questId): 토글 (추가/제거)
- QuestVisibility: 전체 퀘스트 리스트 + Eye/EyeOff 토글
- visibleQuests = quests.filter(not in hiddenQuestIds)
- Stats/Today/Quests 탭 모두 visibleQuests 기준
