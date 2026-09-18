import {
  BookHeart,
  Castle,
  Flame,
  Ghost,
  Heart,
  Joystick,
  Laugh,
  type LucideIcon,
  Map,
  Orbit,
  Search,
  Shield,
  Sparkles,
  Swords,
  WandSparkles,
} from "lucide-react";

export type Category = Readonly<{
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
}>;

export const CATEGORIES: readonly Category[] = [
  {
    slug: "action",
    name: "أكشن",
    description: "معارك وإيقاع سريع",
    icon: Swords,
  },
  {
    slug: "adventure",
    name: "مغامرات",
    description: "رحلات وعوالم جديدة",
    icon: Map,
  },
  {
    slug: "fantasy",
    name: "خيال",
    description: "عوالم تتجاوز الواقع",
    icon: Castle,
  },
  {
    slug: "romance",
    name: "رومانسي",
    description: "حكايات المشاعر والعلاقات",
    icon: Heart,
  },
  {
    slug: "mystery",
    name: "غموض",
    description: "ألغاز وأسرار متشابكة",
    icon: Search,
  },
  {
    slug: "horror",
    name: "رعب",
    description: "حكايات مظلمة ومقلقة",
    icon: Ghost,
  },
  {
    slug: "comedy",
    name: "كوميدي",
    description: "مواقف خفيفة ومرحة",
    icon: Laugh,
  },
  {
    slug: "drama",
    name: "دراما",
    description: "صراعات إنسانية مؤثرة",
    icon: Flame,
  },
  {
    slug: "magic",
    name: "سحر",
    description: "تعويذات وقوى غامضة",
    icon: WandSparkles,
  },
  {
    slug: "games",
    name: "ألعاب",
    description: "تحديات وأنظمة ومستويات",
    icon: Joystick,
  },
  {
    slug: "historical",
    name: "تاريخي",
    description: "حكايات من أزمنة بعيدة",
    icon: Shield,
  },
  {
    slug: "slice-of-life",
    name: "شريحة من الحياة",
    description: "تفاصيل يومية دافئة",
    icon: BookHeart,
  },
  {
    slug: "supernatural",
    name: "خوارق",
    description: "ظواهر وقوى غير مألوفة",
    icon: Sparkles,
  },
  {
    slug: "science-fiction",
    name: "خيال علمي",
    description: "مستقبل وتقنيات بعيدة",
    icon: Orbit,
  },
] as const;
