import { Bookmark, LayoutDashboard, Settings } from "lucide-react";

export const WORKSPACE_NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "\u0644\u0648\u062d\u0629 \u0627\u0644\u062d\u0633\u0627\u0628",
    icon: LayoutDashboard,
  },
  {
    href: "/library",
    label:
      "\u0627\u0644\u0645\u0643\u062a\u0628\u0629 \u0648\u0627\u0644\u0645\u062d\u0641\u0648\u0638\u0627\u062a",
    icon: Bookmark,
  },
  {
    href: "/settings",
    label:
      "\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0627\u0644\u062d\u0633\u0627\u0628",
    icon: Settings,
  },
] as const;
