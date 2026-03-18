import Link from "next/link";
import { getCourses } from "@/lib/data/courses";
import { AdminCoursesList } from "@/components/admin/courses/AdminCoursesList";

export default function AdminCoursesPage() {
  const courses = getCourses();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">課程列表</h2>
        <Link
          href="/admin/courses/new"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          新增課程
        </Link>
      </div>
      <AdminCoursesList courses={courses} />
    </div>
  );
}
