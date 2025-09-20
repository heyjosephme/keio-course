import React from "react";
import CourseSelectionClient from "./CourseSelectionClient";
import { getAllCourses } from "@/lib/data/courseLoader";

export default async function CoursesPage() {
  // Server-side data fetching
  const courses = getAllCourses();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">コース選択</h1>
          <p className="mt-2 text-gray-600">
            カレンダーに追加するコースを選択してください
          </p>
        </div>
        <CourseSelectionClient courses={courses} />
      </div>
    </div>
  );
}
