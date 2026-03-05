/**
 * 타입 안전한 Lucide 아이콘 매핑 유틸리티
 *
 * quests.json에서 아이콘 이름을 문자열로 받아오기 때문에,
 * (Icons as any)[name] 패턴 대신 이 유틸리티를 사용합니다.
 */
import {
  ClipboardList,
  Users,
  Building2,
  Camera,
  User,
  Gem,
  Mail,
  Home,
  Hammer,
  Sofa,
  Heart,
  Plane,
  Truck,
  FileText,
  Circle,
  type LucideIcon,
} from 'lucide-react';

/**
 * Quest 데이터에서 사용하는 아이콘 이름과 Lucide 컴포넌트의 매핑.
 * 새 Quest 아이콘을 추가할 때 이 맵에도 추가해야 합니다.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  ClipboardList,
  Users,
  Building2,
  Camera,
  User,
  Gem,
  Mail,
  Home,
  Hammer,
  Sofa,
  Heart,
  Plane,
  Truck,
  FileText,
};

/**
 * 아이콘 이름 문자열로부터 타입 안전하게 Lucide 아이콘 컴포넌트를 반환합니다.
 * 매핑에 없는 이름이면 기본 Circle 아이콘을 반환합니다.
 *
 * @param iconName - Quest의 icon 필드 문자열 (예: "ClipboardList")
 * @returns Lucide 아이콘 컴포넌트
 */
export function getQuestIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] ?? Circle;
}

/** ICON_MAP에 등록된 아이콘 이름의 유니온 타입 */
export type QuestIconName = keyof typeof ICON_MAP;
