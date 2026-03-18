import { notFound } from "next/navigation";
import { getCourseById, getCourses } from "@/lib/data/courses";
import { AdminCourseFormWrapper } from "@/components/admin/courses/AdminCourseFormWrapper";

export function generateStaticParams() {
  return getCourses().map((c) => ({ id: c.id }));
}

export default async function AdminCourseEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getCourseById(id);
  if (!course) notFound();

  return (
    <AdminCourseFormWrapper
      initialData={course}
      title="編輯課程"
      subtitle={course.title}
    />
  );
}
