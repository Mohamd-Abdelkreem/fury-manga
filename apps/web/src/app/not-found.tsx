import Link from "next/link";

export default function NotFound() {
  return (
    <main className="state-page" dir="rtl">
      <p className="eyebrow">404</p>
      <h1>الصفحة غير موجودة</h1>
      <Link href="/">العودة إلى Fury</Link>
    </main>
  );
}
