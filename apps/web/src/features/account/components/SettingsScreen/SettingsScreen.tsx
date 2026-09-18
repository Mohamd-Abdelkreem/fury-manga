import { KeyRound, MessageCircle, ShieldCheck, UserRound } from "lucide-react";

import { AppearanceSettings } from "@/features/account/components/AppearanceSettings/AppearanceSettings";
import { AvatarPicker } from "@/features/account/components/AvatarPicker/AvatarPicker";
import { ProfileForm } from "@/features/users/components/profile-form";

import { PasswordForm } from "../password-form";
import { SessionControls } from "../session-controls";
import styles from "./SettingsScreen.module.css";

const sectionLinks = [
  { href: "#account", label: "الحساب", icon: UserRound },
  { href: "#security", label: "الأمان", icon: ShieldCheck },
  { href: "#avatar-frame", label: "إطار الصورة", icon: KeyRound },
  { href: "#comment-decoration", label: "زخرفة التعليق", icon: MessageCircle },
] as const;

export function SettingsScreen() {
  return (
    <main
      className={`workspace-main ${styles["main"] ?? ""}`}
      id="main-content"
    >
      <header className={styles["hero"]}>
        <div>
          <p className="eyebrow">إعدادات Fury</p>
          <h1>حسابك، أمانك، ومظهرك</h1>
          <p>
            حدّث اسم العرض عبر حسابك الحقيقي، وأدر كلمات المرور والجلسات، ثم
            عاين هدايا المظهر محليًا.
          </p>
        </div>
      </header>

      <nav className={styles["sectionNav"]} aria-label="أقسام الإعدادات">
        {sectionLinks.map(({ href, icon: Icon, label }) => (
          <a href={href} key={href}>
            <Icon aria-hidden="true" />
            {label}
          </a>
        ))}
      </nav>

      <section
        className={styles["section"]}
        id="account"
        aria-labelledby="account-title"
      >
        <div className={styles["sectionHeading"]}>
          <p className="eyebrow">البيانات الأساسية</p>
          <h2 id="account-title">الحساب</h2>
          <p>
            البريد للعرض فقط. تعديل الاسم يستخدم سلوك الحساب المتصل بالخادم؛
            صورة الحساب أدناه معاينة محلية فقط.
          </p>
        </div>
        <ProfileForm />
        <AvatarPicker />
      </section>

      <section
        className={styles["security"]}
        id="security"
        aria-labelledby="security-title"
      >
        <div className={styles["sectionHeading"]}>
          <p className="eyebrow">حماية الوصول</p>
          <h2 id="security-title">الأمان والجلسات</h2>
          <p>
            هذه الإجراءات متصلة بسلوك المصادقة الحالي ولم تُستبدل بمحاكاة محلية.
          </p>
        </div>
        <PasswordForm />
        <SessionControls />
      </section>

      <AppearanceSettings />
    </main>
  );
}
