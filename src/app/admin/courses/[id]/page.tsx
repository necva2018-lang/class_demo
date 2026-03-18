import { notFound } from "next/navigation";
import { getCourseById, getCourses } from "@/lib/data/courses";
import { AdminCourseFormWrapper } from "@/components/admin/courses/AdminCourseFormWrapper";

export function generateStaticParams() {
  // Async data source (DB). Disable SSG params here.
  return [];
}

export default async function AdminCourseEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) notFound();

  return (
    <AdminCourseFormWrapper
      initialData={course}
      title="編輯課程"
      subtitle={course.title}
    />
  );
}
