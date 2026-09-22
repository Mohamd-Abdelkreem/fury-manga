export type AdminCategory = Readonly<{
  id: string;
  name: string;
  slug: string;
  enabled: boolean;
  displayOrder: number;
  worksCount: number;
}>;

export const ADMIN_CATEGORY_FIXTURES: readonly AdminCategory[] = [
  {
    id: "action",
    name: "أكشن",
    slug: "action",
    enabled: true,
    displayOrder: 1,
    worksCount: 18,
  },
  {
    id: "fantasy",
    name: "خيال",
    slug: "fantasy",
    enabled: true,
    displayOrder: 2,
    worksCount: 24,
  },
  {
    id: "romance",
    name: "رومانسي",
    slug: "romance",
    enabled: true,
    displayOrder: 3,
    worksCount: 9,
  },
  {
    id: "historical",
    name: "تاريخي",
    slug: "historical",
    enabled: false,
    displayOrder: 4,
    worksCount: 3,
  },
];
