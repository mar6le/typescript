import { Classroom, Course, Lesson, Professor } from "../types/schedule.types.js";

export const professors: Professor[] = [];
export const classrooms: Classroom[] = [];
export const courses: Course[] = [];
export const schedule: Lesson[] = [];

export let lessonIdCounter: number = 1;

export function incrementLessonId(): number {
	return lessonIdCounter++;
}
