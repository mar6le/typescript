import { Classroom, DayOfWeek, Lesson, TimeSlot } from "../types/schedule.types.js";
import { classrooms, schedule } from "./data-storage.module.js";

export function addClassroom(classroom: Classroom): void {
	classrooms.push(classroom);
}

export function getClassroomInfo(classroomNumber: string): Classroom | null {
	const classroom: Classroom | undefined = classrooms.find((c: Classroom) => c.number === classroomNumber);
	return classroom !== undefined ? classroom : null;
}

export function getClassroomSchedule(classroomNumber: string): Lesson[] {
	return schedule.filter((lesson: Lesson) => lesson.classroomNumber === classroomNumber);
}

export function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
	const occupiedClassrooms: string[] = schedule
		.filter((lesson: Lesson) => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
		.map((lesson: Lesson) => lesson.classroomNumber);

	return classrooms
		.filter((classroom: Classroom) => !occupiedClassrooms.includes(classroom.number))
		.map((classroom: Classroom) => classroom.number);
}

export function getClassroomUtilization(classroomNumber: string): number {
	const daysPerWeek: number = 5;
	const slotsPerDay: number = 5;
	const totalSlots: number = daysPerWeek * slotsPerDay;

	const occupiedSlots: number = schedule.filter((lesson: Lesson) => lesson.classroomNumber === classroomNumber).length;

	const utilization: number = (occupiedSlots / totalSlots) * 100;

	return Math.round(utilization * 100) / 100;
}
