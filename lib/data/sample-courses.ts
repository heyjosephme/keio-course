import { CourseSession } from "@/lib/types/calendar";

export const sampleCourses: CourseSession[] = [
  {
    id: "1",
    courseCode: "ECO101",
    courseName: "Microeconomics",
    professor: "Dr. Tanaka",
    location: "Room 301",
    startTime: "10:00",
    endTime: "11:30",
    dayOfWeek: 1, // Monday
    color: "#3B82F6", // Blue
    type: "lecture",
  },
  {
    id: "2",
    courseCode: "ECO201",
    courseName: "Macroeconomics",
    professor: "Prof. Suzuki",
    location: "Hall A",
    startTime: "13:00",
    endTime: "14:30",
    dayOfWeek: 2, // Tuesday
    color: "#10B981", // Green
    type: "lecture",
  },
  {
    id: "3",
    courseCode: "STAT101",
    courseName: "Statistics for Economics",
    professor: "Dr. Yamamoto",
    location: "Lab 205",
    startTime: "14:00",
    endTime: "16:00",
    dayOfWeek: 3, // Wednesday
    color: "#8B5CF6", // Purple
    type: "lab",
  },
  {
    id: "4",
    courseCode: "ECO301",
    courseName: "International Economics",
    professor: "Prof. Ito",
    location: "Seminar Room B",
    startTime: "15:00",
    endTime: "17:00",
    dayOfWeek: 4, // Thursday
    color: "#F59E0B", // Amber
    type: "seminar",
  },
  {
    id: "5",
    courseCode: "ECO101",
    courseName: "Microeconomics",
    professor: "Dr. Tanaka",
    location: "Room 301",
    startTime: "10:00",
    endTime: "11:30",
    dayOfWeek: 5, // Friday (repeat session)
    color: "#3B82F6", // Blue
    type: "lecture",
  },
];
