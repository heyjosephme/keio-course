"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Course } from "@/lib/data/courseLoader";

interface CourseSelectorProps {
  courses: Course[]; // Pass courses as props instead of fetching
  onCourseSelect: (course: Course) => void;
  onCourseDeselect: (course: Course) => void;
  selectedCourses: Course[];
  showDayFilter?: boolean; // Optional: hide day filter for weekend courses
}

export default function CourseSelector({
  courses,
  onCourseSelect,
  onCourseDeselect,
  selectedCourses,
  showDayFilter = true,
}: CourseSelectorProps) {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
  const [selectedFaculty, setSelectedFaculty] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<string>("all");

  useEffect(() => {
    // Filter courses based on selected filters
    let filtered = courses;

    if (selectedFaculty !== "all") {
      filtered = filtered.filter(
        (course) => course.faculty === selectedFaculty
      );
    }

    if (selectedDay !== "all" && showDayFilter) {
      filtered = filtered.filter(
        (course) =>
          course.day_of_week === selectedDay || course.schedule === selectedDay
      );
    }

    setFilteredCourses(filtered);
  }, [courses, selectedFaculty, selectedDay]);

  const faculties = Array.from(
    new Set(courses.map((course) => course.faculty))
  );
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

  const days = Array.from(
    new Set(
      courses
        .map((course) => course.day_of_week || course.schedule)
        .filter(Boolean)
    )
  ) as string[];

  const isSelected = (course: Course) => {
    return selectedCourses.some((selected) => selected.code === course.code);
  };

  const hasConflict = (course: Course) => {
    if (isSelected(course)) return false;
    const courseDay = course.day_of_week || course.schedule;
    return selectedCourses.some(
      (selected) => (selected.day_of_week || selected.schedule) === courseDay
    );
  };

  const handleCourseToggle = (course: Course) => {
    if (isSelected(course)) {
      onCourseDeselect(course);
    } else {
      // Check if there's already a course on the same day
      const courseDay = course.day_of_week || course.schedule;
      const conflictingCourse = selectedCourses.find(
        (selected) => (selected.day_of_week || selected.schedule) === courseDay
      );

      if (conflictingCourse) {
        alert(
          `同じ曜日に既に「${conflictingCourse.name}」が選択されています。先にそのコースを削除してください。`
        );
        return;
      }

      onCourseSelect(course);
    }
  };

  if (!courses.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">利用可能なコースがありません</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">学部</label>
          <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="学部を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全学部</SelectItem>
              {faculties.map((faculty) => (
                <SelectItem key={faculty} value={faculty}>
                  {faculty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showDayFilter && (
          <div className="space-y-2">
            <label className="text-sm font-medium">曜日</label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="曜日を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全曜日</SelectItem>
                {days.map((day) => (
                  <SelectItem key={day} value={day}>
                    {translateDay(day)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Selected Courses Summary */}
      {selectedCourses.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            選択中のコース ({selectedCourses.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedCourses.map((course) => (
              <span
                key={course.code}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
              >
                {course.code} - {course.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Course List */}
      <div className="space-y-3">
        <h3 className="font-semibold">
          利用可能なコース ({filteredCourses.length})
        </h3>

        {filteredCourses.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            フィルター条件に一致するコースが見つかりません
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredCourses.map((course) => (
              <div
                key={course.code}
                className={`border rounded-lg p-4 transition-colors ${
                  isSelected(course)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {course.code}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {course.credits}単位
                      </span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {course.faculty}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {course.name}
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>講師: {course.instructor}</div>
                      <div>
                        曜日:{" "}
                        {translateDay(
                          course.day_of_week || course.schedule || ""
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant={isSelected(course) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCourseToggle(course)}
                    disabled={hasConflict(course)}
                  >
                    {isSelected(course)
                      ? "選択済み"
                      : hasConflict(course)
                      ? "時間重複"
                      : "選択"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
