import type { Metadata } from "next";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader/AdminPageHeader";
import { AdminUserDetail } from "@/features/admin/components/AdminUserDetail/AdminUserDetail";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { userId } = await params;
  return {
    title: `تفاصيل المستخدم (${userId})`,
    description:
      "استعراض تفاصيل حساب المستخدم وسجل القراءة والملاحظات الإشرافية",
  };
}

export default async function UserDetailPage({ params }: PageProps) {
  const { userId } = await params;

  return (
    <div>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "المستخدمين", href: "/admin/users" },
          { label: "تفاصيل المستخدم" },
        ]}
        title="ملف المستخدم"
        description="استعراض حالة الحساب، سجل القراءة، الأعمال المحفوظة، والهدايا التقديرية الممنوحة."
      />

      <AdminUserDetail userId={userId} />
    </div>
  );
}
