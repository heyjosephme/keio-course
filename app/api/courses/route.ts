import { NextResponse } from 'next/server';
import { getAllCourses } from '@/lib/data/courseLoader';

export async function GET() {
  try {
    const courses = getAllCourses();
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}