"use client";

import { MangaCard } from "@/components/ui/MangaCard/MangaCard";
import { useSession } from "@/features/auth/hooks/auth.hooks";
import { TRENDING_DATA } from "@/features/home/data/trendingData";

export function DashboardOverview() {
  const user = useSession().data?.user ?? null;
  if (user === null) return null;

  return (
    <main className="workspace-main">
      <header className="workspace-title">
        <div>
          <p className="eyebrow">Fury library</p>
          <h1>Welcome, {user.fullName.split(" ")[0]}.</h1>
          <p className="workspace-title__summary">
            Continue with community favorites and manage your reading account.
          </p>
        </div>
        <span className="status-badge">
          <i aria-hidden="true" />
          {user.status === "ACTIVE" ? "Account active" : user.status}
        </span>
      </header>
      <section aria-labelledby="recommended-title">
        <div className="workspace-title">
          <div>
            <p className="eyebrow">Recommended now</p>
            <h2 id="recommended-title">Popular on Fury</h2>
          </div>
        </div>
        <div className="dashboard-shelf">
          {TRENDING_DATA.slice(0, 6).map((manga) => (
            <MangaCard key={manga.id} {...manga} stretch />
          ))}
        </div>
      </section>
    </main>
  );
}
