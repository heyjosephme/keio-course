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
import { CourseSession } from "@/lib/types/calendar";
import { Course } from "@/lib/data/courseLoader";
import { Button } from "@/components/ui/button";

export default function CalendarView() {
  const [viewType, setViewType] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  // Load selected courses from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('selectedCourses');
    if (stored) {
      setSelectedCourses(JSON.parse(stored));
    }
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

  // Convert Course to CourseSession format
  const convertToCourseSessions = (courses: Course[]): CourseSession[] => {
    return courses.map(course => {
      // Handle both evening courses (day_of_week) and weekend courses (schedule)
      let dayOfWeek: number;
      let startTime: string;
      let endTime: string;

      if (course.schedule === "土日") {
        // Weekend courses - show on Saturday for simplicity
        dayOfWeek = 6; // Saturday
        startTime = "13:30";
        endTime = "17:15";
      } else {
        // Evening courses
        dayOfWeek = getDayNumber(course.day_of_week || "monday");
        startTime = "18:20";
        endTime = "20:05";
      }

      return {
        id: course.code,
        courseCode: course.code,
        courseName: course.name,
        professor: course.instructor,
        location: "三田キャンパス", // Default location from YAML
        startTime,
        endTime,
        dayOfWeek,
        color: getFacultyColor(course.faculty),
        type: 'lecture' as const,
      };
    });
  };

  const getDayNumber = (dayName: string): number => {
    const dayMap: { [key: string]: number } = {
      'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
      'thursday': 4, 'friday': 5, 'saturday': 6
    };
    return dayMap[dayName.toLowerCase()] || 1;
  };

  const getFacultyColor = (faculty: string): string => {
    const colorMap: { [key: string]: string } = {
      '総合': '#3B82F6',     // Blue
      '文学部': '#10B981',   // Green
      '経済学部': '#8B5CF6', // Purple
      '法学部': '#F59E0B',   // Amber
      '教職': '#EF4444',     // Red
    };
    return colorMap[faculty] || '#6B7280'; // Default gray
  };

  const courseSessions = convertToCourseSessions(selectedCourses);

  const getCoursesForDay = (dayOfWeek: number) => {
    return courseSessions.filter((course) => course.dayOfWeek === dayOfWeek);
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

  const getCoursePosition = (course: CourseSession) => {
    const [startHour, startMin] = course.startTime.split(":").map(Number);
    const [endHour, endMin] = course.endTime.split(":").map(Number);

    const top = (startHour * 60 + startMin) * (80 / 60); // 80px per hour, starting from 0:00
    const height =
      ((endHour - startHour) * 60 + (endMin - startMin)) * (80 / 60);

    return { top, height };
  };

  return (
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
                const dayOfWeek = day.date.getDay();
                const courses = getCoursesForDay(dayOfWeek);

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
                      <div
                        className="h-full rounded-lg p-2 text-white text-xs shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        style={{ backgroundColor: course.color }}
                      >
                        <div className="font-semibold">{course.courseCode}</div>
                        <div className="opacity-90">{course.courseName}</div>
                        <div className="opacity-90">{course.location}</div>
                        <div className="opacity-90">{course.professor}</div>
                      </div>
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
                const dayOfWeek = day.getDay();
                const courses = getCoursesForDay(dayOfWeek);
                const dayIsToday = isToday(day);

                return (
                  <div
                    key={day.toISOString()}
                    className={`bg-white h-32 p-2 overflow-hidden ${
                      dayIsToday ? 'ring-2 ring-blue-500' : ''
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
                        <div
                          key={course.id}
                          className="text-xs p-1 rounded text-white truncate"
                          style={{ backgroundColor: course.color }}
                          title={`${course.courseCode} - ${course.courseName}`}
                        >
                          {course.courseCode}
                        </div>
                      ))}
                      {courses.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +他{courses.length - 3}件
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
  );
}
