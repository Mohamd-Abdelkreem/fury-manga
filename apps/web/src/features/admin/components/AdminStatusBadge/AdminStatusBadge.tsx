import React from "react";
import {
  Archive,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Layers,
  PauseCircle,
  Sparkles,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ADMIN_CONTENT_TYPE_LABELS,
  ADMIN_PUBLISH_STATUS_LABELS,
  ADMIN_STORY_STATUS_LABELS,
  ADMIN_WORK_TYPE_LABELS,
  type AdminContentType,
  type AdminPublishStatus,
  type AdminStoryStatus,
  type AdminWorkType,
} from "../../types/admin.types";
import styles from "./AdminStatusBadge.module.css";

type BadgeType =
  | { kind: "publish"; status: AdminPublishStatus }
  | { kind: "story"; status: AdminStoryStatus }
  | { kind: "workType"; status: AdminWorkType }
  | { kind: "content"; status: AdminContentType };

export function AdminStatusBadge(props: BadgeType) {
  if (props.kind === "publish") {
    const label = ADMIN_PUBLISH_STATUS_LABELS[props.status];
    if (props.status === "published") {
      return (
        <span className={cn(styles["badge"], styles["published"])}>
          <CheckCircle2 className={styles["icon"]} aria-hidden="true" />
          <span>{label}</span>
        </span>
      );
    }
    if (props.status === "draft") {
      return (
        <span className={cn(styles["badge"], styles["draft"])}>
          <Clock className={styles["icon"]} aria-hidden="true" />
          <span>{label}</span>
        </span>
      );
    }
    return (
      <span className={cn(styles["badge"], styles["archived"])}>
        <Archive className={styles["icon"]} aria-hidden="true" />
        <span>{label}</span>
      </span>
    );
  }

  if (props.kind === "story") {
    const label = ADMIN_STORY_STATUS_LABELS[props.status];
    if (props.status === "ongoing") {
      return (
        <span className={cn(styles["badge"], styles["ongoing"])}>
          <Sparkles className={styles["icon"]} aria-hidden="true" />
          <span>{label}</span>
        </span>
      );
    }
    if (props.status === "completed") {
      return (
        <span className={cn(styles["badge"], styles["completed"])}>
          <CheckCircle2 className={styles["icon"]} aria-hidden="true" />
          <span>{label}</span>
        </span>
      );
    }
    if (props.status === "hiatus") {
      return (
        <span className={cn(styles["badge"], styles["hiatus"])}>
          <PauseCircle className={styles["icon"]} aria-hidden="true" />
          <span>{label}</span>
        </span>
      );
    }
    return (
      <span className={cn(styles["badge"], styles["cancelled"])}>
        <XCircle className={styles["icon"]} aria-hidden="true" />
        <span>{label}</span>
      </span>
    );
  }

  if (props.kind === "workType") {
    const label = ADMIN_WORK_TYPE_LABELS[props.status];
    return (
      <span className={cn(styles["badge"], styles["typeBadge"])}>
        <Layers className={styles["icon"]} aria-hidden="true" />
        <span>{label}</span>
      </span>
    );
  }

  // content kind
  const label = ADMIN_CONTENT_TYPE_LABELS[props.status];
  const Icon = props.status === "illustrated" ? BookOpen : FileText;
  return (
    <span className={cn(styles["badge"], styles["typeBadge"])}>
      <Icon className={styles["icon"]} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
