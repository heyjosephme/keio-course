"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SessionBasedSelector from "@/components/courses/SessionBasedSelector";
import { Button } from "@/components/ui/button";
import { Course } from "@/lib/data/courseLoader";

interface CourseSelectionClientProps {
  courses: Course[];
}

export default function CourseSelectionClient({
  courses,
}: CourseSelectionClientProps) {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const router = useRouter();

  const translateDay = (day: string): string => {
    const dayMap: { [key: string]: string } = {
      monday: "月",
      tuesday: "火",
      wednesday: "水",
      thursday: "木",
      friday: "金",
      saturday: "土",
      sunday: "日",
      土日: "土日",
    };
    return dayMap[day.toLowerCase()] || day;
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourses((prev) => [...prev, course]);
  };

  const handleCourseDeselect = (course: Course) => {
    setSelectedCourses((prev) =>
      prev.filter((selected) => selected.code !== course.code)
    );
  };

  const handleViewCalendar = () => {
    // Store selected courses in localStorage for now
    localStorage.setItem("selectedCourses", JSON.stringify(selectedCourses));
    router.push("/calendar");
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Course Selector */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow p-6">
          <SessionBasedSelector
            allCourses={courses}
            onCourseSelect={handleCourseSelect}
            onCourseDeselect={handleCourseDeselect}
            selectedCourses={selectedCourses}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6 sticky top-8">
          <h3 className="font-semibold mb-4">あなたのスケジュール</h3>

          {selectedCourses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              まだコースが選択されていません
            </p>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <div>合計コース数: {selectedCourses.length}</div>
                <div>
                  合計単位数:{" "}
                  {selectedCourses.reduce(
                    (sum, course) => sum + course.credits,
                    0
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {selectedCourses.map((course) => (
                  <div key={course.code} className="text-sm">
                    <div className="font-medium">{course.name}</div>
                    <div className="text-gray-500">
                      {translateDay(
                        course.day_of_week || course.schedule || ""
                      )}{" "}
                      - {course.credits}単位
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleViewCalendar}
                className="w-full"
                disabled={selectedCourses.length === 0}
              >
                カレンダーを表示
              </Button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-2">コース種別</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>📅 夜間: 月-金 18:20-20:05</div>
              <div>📅 週末: 土日集中</div>
              <div>🏫 場所: 三田キャンパス</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
