"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { Course } from "@/lib/data/courseLoader";
import { CourseSession } from "@/lib/types/calendar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  generateEveningCourseSessions,
  generateWeekendCourseSessions,
  getFacultyColor
} from "@/lib/utils/courseScheduling";
import { getTestSelectedCourses } from "@/lib/utils/testData";
import { downloadICalFile, getExportSummary } from "@/lib/utils/icalExport";

export default function CalendarView() {
  const [viewType, setViewType] = useState<'week' | 'month'>('month'); // Default to month view

  // Set default to October 2025 (course start month) or current month if in session
  const getDefaultDate = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // If we're in the academic session period (Oct 2025 - Jan 2026), show current month
    if ((currentYear === 2025 && currentMonth >= 9) ||
        (currentYear === 2026 && currentMonth <= 0)) {
      return now;
    }

    // Otherwise, default to October 2025 (course start)
    return new Date(2025, 9, 1); // October 2025
  };

  const [currentDate, setCurrentDate] = useState(getDefaultDate());
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  // Load selected courses from localStorage (with test data fallback)
  useEffect(() => {
    const courses = getTestSelectedCourses();
    setSelectedCourses(courses);
  }, []);

  // Week view logic
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start

  // Month view logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const hours = Array.from({ length: 24 }, (_, i) => i); // 0:00 - 23:00
  const translateDayAbbr = (englishDay: string): string => {
    const dayMap: { [key: string]: string } = {
      'Mon': '月',
      'Tue': '火',
      'Wed': '水',
      'Thu': '木',
      'Fri': '金',
      'Sat': '土',
      'Sun': '日'
    };
    return dayMap[englishDay] || englishDay;
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => ({
    date: addDays(weekStart, i),
    name: translateDayAbbr(format(addDays(weekStart, i), "EEE")),
    dayNum: format(addDays(weekStart, i), "d"),
    isToday: isSameDay(addDays(weekStart, i), new Date()),
  }));

  // Convert Course to CourseSession format with proper scheduling
  const convertToCourseSessions = (courses: Course[]): CourseSession[] => {
    const allSessions: CourseSession[] = [];

    courses.forEach(course => {
      const color = getFacultyColor(course.faculty);

      if (course.schedule === "土日") {
        // Weekend courses: Generate both Saturday and Sunday sessions for 3 weekends
        const weekendSessions = generateWeekendCourseSessions(
          course.code,
          course.name,
          course.instructor,
          color
        );
        allSessions.push(...weekendSessions);
      } else if (course.day_of_week) {
        // Evening courses: Generate 12 weekly sessions with proper exclusions
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


  const courseSessions = convertToCourseSessions(selectedCourses);

  const getCoursesForDay = (date: Date) => {
    return courseSessions.filter((session) =>
      isSameDay(session.date, date)
    );
  };

  // Check if date is during 三田祭 period
  const isMitasaiPeriod = (date: Date) => {
    const mitasaiStart = new Date(2025, 10, 19); // Nov 19, 2025
    const mitasaiEnd = new Date(2025, 10, 24);   // Nov 24, 2025
    return date >= mitasaiStart && date <= mitasaiEnd;
  };

  const navigatePrevious = () => {
    if (viewType === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (viewType === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleExportCalendar = () => {
    if (selectedCourses.length === 0) return;

    const sessions = convertToCourseSessions(selectedCourses);
    const summary = getExportSummary(sessions);

    // Show summary and download
    const confirmMessage = `カレンダーを出力します：\n\n` +
      `• コース数: ${summary.uniqueCourses}\n` +
      `• 総授業回数: ${summary.totalSessions}\n` +
      `• 期間: ${summary.dateRange ?
        `${format(summary.dateRange.start, 'yyyy/MM/dd')} ～ ${format(summary.dateRange.end, 'yyyy/MM/dd')}`
        : 'なし'}\n\n` +
      `iCalファイルをダウンロードしますか？`;

    if (confirm(confirmMessage)) {
      downloadICalFile(sessions);
    }
  };

  const getCoursePosition = (course: CourseSession) => {
    const [startHour, startMin] = course.startTime.split(":").map(Number);
    const [endHour, endMin] = course.endTime.split(":").map(Number);

    const top = (startHour * 60 + startMin) * (80 / 60); // 80px per hour, starting from 0:00
    const height =
      ((endHour - startHour) * 60 + (endMin - startMin)) * (80 / 60);

    return { top, height };
  };

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {viewType === 'week'
              ? format(weekStart, "MMM yyyy")
              : format(currentDate, "MMMM yyyy")
            }
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={navigatePrevious}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToToday}
            >
今日
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={navigateNext}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCalendar}
            disabled={selectedCourses.length === 0}
          >
            📥 カレンダー出力
          </Button>
          <Button
            variant={viewType === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('week')}
          >
週表示
          </Button>
          <Button
            variant={viewType === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('month')}
          >
月表示
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        {viewType === 'week' ? (
          // Week View
          <div className="min-w-[800px]">
            {/* Day Headers */}
            <div className="grid grid-cols-8 border-b sticky top-0 bg-white z-10">
              <div className="w-16"></div>
              {weekDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`text-center py-3 border-l ${
                    day.isToday ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="text-xs text-gray-600">{day.name}</div>
                  <div
                    className={`text-lg font-semibold mt-1 ${
                      day.isToday
                        ? "bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto"
                        : ""
                    }`}
                  >
                    {day.dayNum}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Grid */}
            <div className="relative">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-8 h-20 border-b">
                  <div className="w-16 text-xs text-gray-500 text-right pr-2 pt-1">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  {weekDays.map((_, idx) => (
                    <div key={idx} className="border-l relative"></div>
                  ))}
                </div>
              ))}

              {/* Course Events */}
              {weekDays.map((day, dayIdx) => {
                const courses = getCoursesForDay(day.date);

                return courses.map((course) => {
                  const { top, height } = getCoursePosition(course);
                  return (
                    <div
                      key={`${course.id}-${dayIdx}`}
                      className="absolute z-20"
                      style={{
                        left: `${(dayIdx + 1) * 12.5}%`,
                        width: "12.5%",
                        top: `${top}px`,
                        height: `${height}px`,
                        padding: "0 4px",
                      }}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="h-full rounded-lg p-2 text-white text-xs shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            style={{ backgroundColor: course.color }}
                          >
                            <div className="font-semibold">{course.courseName}</div>
                            <div className="opacity-90 text-[10px]">{course.courseCode}</div>
                            <div className="opacity-90">{course.professor}</div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 text-white border border-gray-700">
                          <div className="text-sm">
                            <div className="font-semibold text-white">{course.courseName}</div>
                            <div className="text-gray-300">コード: {course.courseCode}</div>
                            <div className="text-gray-300">講師: {course.professor}</div>
                            <div className="text-gray-300">場所: {course.location}</div>
                            <div className="text-gray-300">時間: {course.startTime}-{course.endTime}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  );
                });
              })}
            </div>
          </div>
        ) : (
          // Month View
          <div className="p-4">
            {/* Month Day Headers */}
            <div className="grid grid-cols-7 gap-px mb-1">
              {['月', '火', '水', '木', '金', '土', '日'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-700 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
              {/* Fill empty cells at the start of month */}
              {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, idx) => (
                <div key={`empty-${idx}`} className="bg-gray-50 h-32"></div>
              ))}

              {/* Month days */}
              {monthDays.map((day) => {
                const courses = getCoursesForDay(day);
                const dayIsToday = isToday(day);
                const isMitasai = isMitasaiPeriod(day);

                return (
                  <div
                    key={day.toISOString()}
                    className={`h-32 p-2 overflow-hidden ${
                      dayIsToday ? 'ring-2 ring-blue-500 bg-white' :
                      isMitasai ? 'bg-orange-50 border border-orange-200' : 'bg-white'
                    }`}
                  >
                    <div
                      className={`text-sm font-medium mb-1 ${
                        dayIsToday
                          ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
                          : 'text-gray-900'
                      }`}
                    >
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {courses.slice(0, 3).map((course) => (
                        <Tooltip key={course.id}>
                          <TooltipTrigger asChild>
                            <div
                              className="text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ backgroundColor: course.color }}
                            >
                              {course.courseName}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-900 text-white border border-gray-700">
                            <div className="text-sm">
                              <div className="font-semibold text-white">{course.courseName}</div>
                              <div className="text-gray-300">コード: {course.courseCode}</div>
                              <div className="text-gray-300">講師: {course.professor}</div>
                              <div className="text-gray-300">時間: {course.startTime}-{course.endTime}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      {courses.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +他{courses.length - 3}件
                        </div>
                      )}
                      {isMitasai && courses.length === 0 && (
                        <div className="text-xs text-orange-600 font-medium">
                          三田祭期間
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      </div>
    </TooltipProvider>
  );
}
