"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CourseSelector from "./CourseSelector";
import { Course } from "@/lib/data/courseLoader";

interface SessionInfo {
  id: string;
  name: string;
  period: string;
  description: string;
  isAvailable: boolean;
  courses: Course[];
}

interface SessionBasedSelectorProps {
  allCourses: Course[];
  onCourseSelect: (course: Course) => void;
  onCourseDeselect: (course: Course) => void;
  selectedCourses: Course[];
}

export default function SessionBasedSelector({
  allCourses,
  onCourseSelect,
  onCourseDeselect,
  selectedCourses,
}: SessionBasedSelectorProps) {
  const [activeSessions, setActiveSessions] = useState<Set<string>>(new Set());

  // Define session types with availability logic
  const sessions: SessionInfo[] = [
    {
      id: "evening",
      name: "夜間スクーリング",
      period: "10月〜1月",
      description: "平日 18:20-20:05",
      isAvailable: true, // Currently available
      courses: allCourses.filter(
        (course) => course.day_of_week && !course.schedule
      ),
    },
    {
      id: "weekend",
      name: "週末スクーリング",
      period: "10月土日",
      description: "3週間集中",
      isAvailable: true, // Currently available
      courses: allCourses.filter((course) => course.schedule === "土日"),
    },
    {
      id: "summer1",
      name: "夏期スクーリングⅠ期",
      period: "8月4日〜9日",
      description: "集中講義",
      isAvailable: false, // Past session
      courses: [], // No courses loaded for summer sessions yet
    },
    {
      id: "summer2",
      name: "夏期スクーリングⅡ期",
      period: "8月18日〜23日",
      description: "集中講義",
      isAvailable: false, // Past session
      courses: [],
    },
    {
      id: "summer3",
      name: "夏期スクーリングⅢ期",
      period: "8月25日〜30日",
      description: "集中講義",
      isAvailable: false, // Past session
      courses: [],
    },
    // TODO: this is incorrect,
    // this is real-time streaming courses
    // rather than a regular e-course
    /*  {
      id: "media",
      name: "メディアスクーリング",
      period: "通年",
      description: "オンライン授業",
      isAvailable: true,
      courses: [], // No media courses loaded yet
    }, */
  ];

  const handleSessionToggle = (sessionId: string, isActive: boolean) => {
    const newActiveSessions = new Set(activeSessions);
    if (isActive) {
      newActiveSessions.add(sessionId);
    } else {
      newActiveSessions.delete(sessionId);
    }
    setActiveSessions(newActiveSessions);
  };

  return (
    <div className="space-y-8">
      {/* Session Selection Row */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">参加するセッションを選択</h2>
        <div className="flex flex-wrap gap-3">
          {sessions.map((session) => (
            <div key={session.id} className="flex flex-col items-center gap-2">
              <Button
                variant={activeSessions.has(session.id) ? "default" : "outline"}
                onClick={() =>
                  handleSessionToggle(
                    session.id,
                    !activeSessions.has(session.id)
                  )
                }
                disabled={!session.isAvailable}
                className="flex flex-col h-auto p-3 min-w-[120px]"
              >
                <div className="text-sm font-medium text-center">
                  {session.name}
                </div>
                <div className="text-xs opacity-70">{session.period}</div>
                <div className="text-xs opacity-70">{session.description}</div>
              </Button>
              {!session.isAvailable && (
                <Badge variant="secondary" className="text-xs">
                  終了済み
                </Badge>
              )}
              {session.isAvailable && session.courses.length === 0 && (
                <Badge variant="outline" className="text-xs">
                  準備中
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Course Selection Areas */}
      <div className="space-y-6">
        {sessions.map((session) => {
          if (!activeSessions.has(session.id) || session.courses.length === 0) {
            return null;
          }

          return (
            <div key={`courses-${session.id}`} className="space-y-4">
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  {session.name} - コース選択
                </h3>
                <CourseSelector
                  courses={session.courses}
                  onCourseSelect={onCourseSelect}
                  onCourseDeselect={onCourseDeselect}
                  selectedCourses={selectedCourses.filter((course) =>
                    session.courses.some((sc) => sc.code === course.code)
                  )}
                  showDayFilter={session.id !== "weekend"}
                />
              </div>
            </div>
          );
        })}

        {activeSessions.size === 0 && (
          <div className="text-center py-12 text-gray-500">
            参加するセッションを選択してください
          </div>
        )}
      </div>
    </div>
  );
}
