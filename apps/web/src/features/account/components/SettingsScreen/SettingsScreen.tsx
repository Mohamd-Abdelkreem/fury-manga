"use client";

import {
  KeyRound,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

import { AppearanceSettings } from "@/features/account/components/AppearanceSettings/AppearanceSettings";
import { AvatarPicker } from "@/features/account/components/AvatarPicker/AvatarPicker";
import { ProfileForm } from "@/features/users/components/profile-form";

import { PasswordForm } from "../password-form";
import { SessionControls } from "../session-controls";
import styles from "./SettingsScreen.module.css";

const sectionLinks = [
  { href: "#account", label: "الحساب", icon: UserRound, id: "account" },
  { href: "#security", label: "الأمان", icon: ShieldCheck, id: "security" },
  {
    href: "#avatar-frame",
    label: "إطار الصورة",
    icon: KeyRound,
    id: "avatar-frame",
  },
  {
    href: "#comment-decoration",
    label: "زخرفة التعليق",
    icon: MessageCircle,
    id: "comment-decoration",
  },
] as const;

export function SettingsScreen() {
  const [activeSection, setActiveSection] = useState<string>("account");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check query params for section deep linking (e.g. from workspace notifications)
    const params = new URLSearchParams(window.location.search);
    const querySection = params.get("section");

    let targetId: string | null = null;
    if (querySection === "avatar-frames" || querySection === "avatar-frame") {
      targetId = "avatar-frame";
    } else if (
      querySection === "comment-decorations" ||
      querySection === "comment-decoration"
    ) {
      targetId = "comment-decoration";
    } else if (querySection === "security") {
      targetId = "security";
    } else if (querySection === "account") {
      targetId = "account";
    } else if (window.location.hash) {
      targetId = window.location.hash.replace("#", "");
    }

    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      const tid = targetId;
      setTimeout(() => {
        setActiveSection(tid);
      }, 0);
    }
  }, []);

  return (
    <main
      className={`workspace-main ${styles["main"] ?? ""}`}
      id="main-content"
    >
      <header className={styles["hero"]} aria-labelledby="settings-hero-title">
        <div className={styles["heroContent"]}>
          <div className={styles["heroText"]}>
            <span className={styles["eyebrow"]}>
              <Sparkles aria-hidden="true" />
              إعدادات الحساب وتخصيص المظهر
            </span>
            <h1 id="settings-hero-title">حسابك، أمانك، ومظهرك</h1>
            <p>
              حدّث اسم العرض، وأدر كلمة المرور والجلسات، واختر هدايا المظهر
              وزخارف التعليقات في مساحتك الخاصة.
            </p>
          </div>
          <div className={styles["statusSummary"]}>
            <div className={styles["statusItem"]}>
              <ShieldCheck aria-hidden="true" />
              <div>
                <strong>حماية الجلسات</strong>
                <span>إدارة كلمة المرور والجلسات</span>
              </div>
            </div>
            <div className={styles["statusItem"]}>
              <KeyRound aria-hidden="true" />
              <div>
                <strong>تخصيص الهوية</strong>
                <span>إطارات وزخارف مملوكة</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className={styles["sectionNav"]} aria-label="أقسام الإعدادات">
        {sectionLinks.map(({ href, icon: Icon, label, id }) => (
          <a
            href={href}
            key={href}
            className={activeSection === id ? styles["activeNavLink"] : ""}
            onClick={() => {
              setActiveSection(id);
            }}
          >
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
          <span className={styles["sectionMark"]} aria-hidden="true" />
          <div>
            <p className={styles["sectionCategory"]}>البيانات الأساسية</p>
            <h2 id="account-title">الحساب</h2>
            <p>
              البريد الإلكتروني للعرض فقط. يمكنك تعديل اسم العرض واختيار صورة
              الحساب من هنا.
            </p>
          </div>
        </div>
        <div className={styles["formContainer"]}>
          <ProfileForm />
          <AvatarPicker />
        </div>
      </section>

      <section
        className={styles["security"]}
        id="security"
        aria-labelledby="security-title"
      >
        <div className={styles["sectionHeading"]}>
          <span className={styles["sectionMark"]} aria-hidden="true" />
          <div>
            <p className={styles["sectionCategory"]}>حماية الوصول</p>
            <h2 id="security-title">الأمان والجلسات</h2>
            <p>
              استخدم هذه الأدوات لتغيير كلمة المرور أو إنهاء الجلسات المفتوحة.
            </p>
          </div>
        </div>
        <div className={styles["formContainer"]}>
          <PasswordForm />
          <SessionControls />
        </div>
      </section>

      <AppearanceSettings />
    </main>
  );
}
