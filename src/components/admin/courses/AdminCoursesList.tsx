"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Course } from "@/types";
import { setCoursesLocal } from "@/lib/data/courses";
import { MAIN_CATEGORY_LABELS, SUB_CATEGORY_LABELS } from "@/types/course";
import type { CourseStatus } from "@/types/course";
import {
  AdminCard,
  AdminTable,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
} from "@/components/admin";

const STATUS_LABELS: Record<CourseStatus, string> = {
  open: "招生中",
  full: "已額滿",
  closed: "已截止",
  coming: "即將開放",
};

interface AdminCoursesListProps {
  courses: Course[];
}

export function AdminCoursesList({ courses: initialCourses }: AdminCoursesListProps) {
  const [keyword, setKeyword] = useState("");
  const [mainCategory, setMainCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [featured, setFeatured] = useState<string>("");
  const [courses, setCourses] = useState(initialCourses);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (keyword) {
        const k = keyword.toLowerCase();
        if (
          !c.title.toLowerCase().includes(k) &&
          !c.summary.toLowerCase().includes(k) &&
          !c.tags.some((t) => t.toLowerCase().includes(k))
        ) {
          return false;
        }
      }
      if (mainCategory && c.mainCategory !== mainCategory) return false;
      if (subCategory && c.subCategory !== subCategory) return false;
      if (status && c.status !== status) return false;
      if (featured === "yes" && !c.featured) return false;
      if (featured === "no" && c.featured) return false;
      return true;
    });
  }, [courses, keyword, mainCategory, subCategory, status, featured]);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`確定要刪除「${title}」嗎？`)) {
      const next = courses.filter((c) => c.id !== id);
      setCourses(next);
      setCoursesLocal(next);
    }
  };

  return (
    <div className="space-y-4">
      {/* 工具列 */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <input
          type="search"
          placeholder="搜尋課程標題、摘要、標籤..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full min-w-[200px] max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <select
          value={mainCategory}
          onChange={(e) => setMainCategory(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        >
          <option value="">全部主分類</option>
          <option value="government">{MAIN_CATEGORY_LABELS.government}</option>
          <option value="paid">{MAIN_CATEGORY_LABELS.paid}</option>
        </select>
        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        >
          <option value="">全部子分類</option>
          {Object.entries(SUB_CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        >
          <option value="">全部狀態</option>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={featured}
          onChange={(e) => setFeatured(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        >
          <option value="">全部</option>
          <option value="yes">精選</option>
          <option value="no">非精選</option>
        </select>
        <button
          type="button"
          onClick={() => {
            setKeyword("");
            setMainCategory("");
            setSubCategory("");
            setStatus("");
            setFeatured("");
          }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          清除篩選
        </button>
      </div>

      {/* 表格 */}
      <AdminCard>
        {filtered.length > 0 ? (
          <AdminTable>
            <AdminTableHead>
              <AdminTableHeaderCell>課程名稱</AdminTableHeaderCell>
              <AdminTableHeaderCell>主分類</AdminTableHeaderCell>
              <AdminTableHeaderCell>子分類</AdminTableHeaderCell>
              <AdminTableHeaderCell>開課日期</AdminTableHeaderCell>
              <AdminTableHeaderCell>狀態</AdminTableHeaderCell>
              <AdminTableHeaderCell>精選</AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right">操作</AdminTableHeaderCell>
            </AdminTableHead>
            <AdminTableBody>
              {filtered.map((course) => (
                <AdminTableRow key={course.id}>
                  <AdminTableCell>
                    <span className="font-medium">{course.title}</span>
                  </AdminTableCell>
                  <AdminTableCell>{MAIN_CATEGORY_LABELS[course.mainCategory]}</AdminTableCell>
                  <AdminTableCell>{SUB_CATEGORY_LABELS[course.subCategory]}</AdminTableCell>
                  <AdminTableCell>{course.startDate}</AdminTableCell>
                  <AdminTableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        course.status === "open"
                          ? "bg-green-100 text-green-800"
                          : course.status === "full"
                            ? "bg-amber-100 text-amber-800"
                            : course.status === "closed"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {STATUS_LABELS[course.status]}
                    </span>
                  </AdminTableCell>
                  <AdminTableCell>{course.featured ? "是" : "否"}</AdminTableCell>
                  <AdminTableCell className="text-right">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="text-primary-600 hover:underline"
                    >
                      編輯
                    </Link>
                    <span className="mx-2 text-slate-300">|</span>
                    <a
                      href={`/courses/${course.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      預覽
                    </a>
                    <span className="mx-2 text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(course.id, course.title)}
                      className="text-red-600 hover:underline"
                    >
                      刪除
                    </button>
                  </AdminTableCell>
                </AdminTableRow>
              ))}
            </AdminTableBody>
          </AdminTable>
        ) : (
          <p className="py-12 text-center text-slate-500">
            尚無符合條件的課程
            {courses.length === 0 ? "，點擊上方「新增課程」開始新增" : "，請調整篩選條件"}
          </p>
        )}
        {filtered.length > 0 && (
          <p className="mt-4 text-sm text-slate-500">共 {filtered.length} 筆</p>
        )}
      </AdminCard>
    </div>
  );
}
