"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useId, useState } from "react";

import { FeatureState } from "@/components/ui/FeatureState/FeatureState";
import { CATEGORIES, type Category } from "../../data/categories";
import styles from "./CategoriesDirectory.module.css";

type CategoriesDirectoryProps = Readonly<{
  categories?: readonly Category[];
}>;

export function CategoriesDirectory({
  categories = CATEGORIES,
}: CategoriesDirectoryProps) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());
  const filtered = categories.filter((category) =>
    category.name.includes(deferredQuery),
  );

  return (
    <main className={styles["main"]} id="main-content">
      <header className={styles["hero"]}>
        <p className="eyebrow">دليل Fury</p>
        <h1>التصنيفات</h1>
        <p>ابدأ من النوع الذي تحبه، ثم استكشف الأعمال المصوّرة المطابقة له.</p>
      </header>

      <div className={styles["searchField"]}>
        <label htmlFor={searchId}>ابحث في أسماء التصنيفات</label>
        <div className={styles["searchControl"]}>
          <Search aria-hidden="true" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder="مثال: أكشن أو خيال"
          />
        </div>
      </div>

      {categories.length === 0 ? (
        <FeatureState
          kind="empty"
          title="لا توجد تصنيفات الآن"
          message="ستظهر التصنيفات هنا عندما تصبح متاحة."
        />
      ) : filtered.length === 0 ? (
        <FeatureState
          kind="filtered-empty"
          title="لا يوجد تصنيف مطابق"
          message={`لم نعثر على تصنيف باسم «${deferredQuery}». جرّب كلمة أقصر.`}
        />
      ) : (
        <section aria-label="قائمة التصنيفات" className={styles["grid"]}>
          {filtered.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/discover?genre=${category.slug}`}
                className={styles["card"]}
              >
                <span className={styles["iconWrap"]}>
                  <Icon aria-hidden="true" />
                </span>
                <span>
                  <strong>{category.name}</strong>
                  <small>{category.description}</small>
                </span>
              </Link>
            );
          })}
        </section>
      )}
    </main>
  );
}
