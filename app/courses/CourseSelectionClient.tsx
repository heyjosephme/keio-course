"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SessionBasedSelector from "@/components/courses/SessionBasedSelector";
import { Button } from "@/components/ui/button";
import { Course } from "@/lib/data/courseLoader";
import { downloadICalFile, getExportSummary } from "@/lib/utils/icalExport";
import {
  generateEveningCourseSessions,
  generateWeekendCourseSessions,
  getFacultyColor
} from "@/lib/utils/courseScheduling";
import { format } from "date-fns";

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

  // Convert courses to course sessions for export/preview
  const convertToCourseSessions = (courses: Course[]) => {
    const allSessions: any[] = [];

    courses.forEach(course => {
      const color = getFacultyColor(course.faculty);

      if (course.schedule === "土日") {
        // Weekend courses
        const weekendSessions = generateWeekendCourseSessions(
          course.code,
          course.name,
          course.instructor,
          color
        );
        allSessions.push(...weekendSessions);
      } else if (course.day_of_week) {
        // Evening courses
        const eveningSessions = generateEveningCourseSessions(
          course.code,
          course.name,
          course.instructor,
          course.day_of_week,
          color
        );
        allSessions.push(...eveningSessions);
      }
    });

    return allSessions;
  };

  const handleExportCalendar = () => {
    if (selectedCourses.length === 0) return;

    const sessions = convertToCourseSessions(selectedCourses);
    const summary = getExportSummary(sessions);

    const confirmMessage = `選択中のコースをiCalファイルで出力します：\n\n` +
      `• コース数: ${summary.uniqueCourses}\n` +
      `• 総授業回数: ${summary.totalSessions}\n` +
      `• 期間: ${summary.dateRange ?
        `${format(summary.dateRange.start, 'yyyy/MM/dd')} ～ ${format(summary.dateRange.end, 'yyyy/MM/dd')}`
        : 'なし'}\n\n` +
      `カレンダーアプリでインポートできるファイルをダウンロードしますか？`;

    if (confirm(confirmMessage)) {
      downloadICalFile(sessions);
    }
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

              <div className="space-y-2">
                <Button
                  onClick={handleViewCalendar}
                  className="w-full"
                  disabled={selectedCourses.length === 0}
                >
                  詳細カレンダーを表示
                </Button>
                <Button
                  onClick={handleExportCalendar}
                  variant="outline"
                  className="w-full"
                  disabled={selectedCourses.length === 0}
                >
                  📥 iCal出力
                </Button>
              </div>
            </div>
          )}

          {/* Simple Schedule Preview */}
          {selectedCourses.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">週間スケジュール</h4>
              <div className="space-y-1 text-xs">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map(day => {
                  const dayName = { monday: '月', tuesday: '火', wednesday: '水', thursday: '木', friday: '金' }[day];
                  const course = selectedCourses.find(c => c.day_of_week === day);
                  return (
                    <div key={day} className="flex justify-between">
                      <span className="font-medium">{dayName}曜日:</span>
                      <span className={course ? "text-blue-600" : "text-gray-400"}>
                        {course ? course.name.slice(0, 12) + (course.name.length > 12 ? '...' : '') : '─'}
                      </span>
                    </div>
                  );
                })}
                {selectedCourses.some(c => c.schedule === '土日') && (
                  <div className="flex justify-between">
                    <span className="font-medium">週末:</span>
                    <span className="text-green-600">
                      {selectedCourses.find(c => c.schedule === '土日')?.name.slice(0, 12) +
                       (selectedCourses.find(c => c.schedule === '土日')?.name.length > 12 ? '...' : '')}
                    </span>
                  </div>
                )}
              </div>
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
