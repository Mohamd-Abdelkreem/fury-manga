import { ProfileForm } from "@/features/users/components/profile-form";

import { PasswordForm } from "./password-form";
import { SessionControls } from "./session-controls";

export function AccountSettings() {
  return (
    <main className="workspace-main">
      <header className="workspace-title">
        <div>
          <p className="eyebrow">Fury account</p>
          <h1>Your profile and sessions</h1>
        </div>
        <p className="workspace-title__summary">
          Keep your reader profile current, change your password, or end active
          sessions.
        </p>
      </header>
      <div className="settings-stack">
        <ProfileForm />
        <PasswordForm />
        <SessionControls />
      </div>
    </main>
  );
}
