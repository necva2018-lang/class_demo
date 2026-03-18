"use client";

import { useRouter } from "next/navigation";
import type { Course } from "@/types";
import { withBasePath } from "@/lib/routes";
import { CourseForm } from "./CourseForm";

interface AdminCourseFormWrapperProps {
  initialData?: Course | null;
  title: string;
  subtitle?: string;
}

/**
 * 課程表單 Client 包裝
 * 串接 setCoursesLocal、儲存成功後導回列表
 */
export function AdminCourseFormWrapper({
  initialData,
  title,
  subtitle,
}: AdminCourseFormWrapperProps) {
  const router = useRouter();

  const handleSave = async (data: Course) => {
    const res = await fetch(withBasePath("/api/config/courses"), { cache: "no-store" });
    const json = (await res.json()) as { value: Course[] | null };
    const courses = json.value ?? [];
    const exists = courses.some((c) => c.id === data.id || c.slug === data.slug);
    const next = exists
      ? courses.map((c) => (c.id === data.id || c.slug === data.slug ? data : c))
      : [...courses, data];

    const saveRes = await fetch(withBasePath("/api/config/courses"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: next }),
    });
    if (!saveRes.ok) {
      alert("儲存失敗（資料庫）");
      return;
    }
    alert("儲存成功");
    router.push("/admin/courses");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
      </div>
      <CourseForm initialData={initialData ?? undefined} onSave={handleSave} />
    </div>
  );
}
