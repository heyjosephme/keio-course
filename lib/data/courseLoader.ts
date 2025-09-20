import { readFileSync } from "fs";
import { parse } from "yaml";
import path from "path";

export interface Course {
  code: string;
  name: string;
  credits: number;
  instructor: string;
  faculty: string;
  day_of_week?: string; // Optional for weekend courses
  schedule?: string; // For weekend courses ("土日")
}

export interface CourseData {
  evening_courses: {
    schedule_info: {
      duration: string;
      period: string;
      session_length: string;
      total_sessions: number;
      time: string;
      location: string;
      excluded_days: string[];
      special_holiday_classes: string[];
      mitasai_period: {
        start: string;
        end: string;
      };
      makeup_day_rule: string;
      notes: string;
    };
    courses: Course[];
  };
  weekend_courses: {
    schedule_info: any;
    courses: Course[];
  };
}

export function loadCourseData(): CourseData {
  try {
    const yamlPath = path.join(process.cwd(), "data", "courses.yaml");
    const fileContents = readFileSync(yamlPath, "utf8");
    return parse(fileContents);
  } catch (error) {
    console.error("Error loading course data:", error);
    throw new Error("Failed to load course data");
  }
}

export function getAllCourses(): Course[] {
  const data = loadCourseData();

  // Combine evening and weekend courses
  const eveningCourses = data.evening_courses.courses || [];
  const weekendCourses = data.weekend_courses.courses || [];

  return [...eveningCourses, ...weekendCourses];
}

export function getCoursesByFaculty(faculty: string): Course[] {
  return getAllCourses().filter((course) => course.faculty === faculty);
}

export function getCoursesByDay(day: string): Course[] {
  return getAllCourses().filter((course) => course.day_of_week === day);
}
