import { DayOfWeek, Lesson, ScheduleConflict, TimeSlot } from "../types/schedule.types.js";
import { classrooms, courses, incrementLessonId, professors, schedule } from "./data-storage.module.js";

export function createLesson(
	courseId: number,
	professorId: number,
	classroomNumber: string,
	dayOfWeek: DayOfWeek,
	timeSlot: TimeSlot,
): Lesson {
	const lesson: Lesson = {
		id: incrementLessonId(),
		courseId,
		professorId,
		classroomNumber,
		dayOfWeek,
		timeSlot,
	};
	return lesson;
}

export function addLesson(lesson: Lesson): boolean {
	const conflict: ScheduleConflict | null = validateLesson(lesson);

	if (conflict !== null) {
		console.log(`Конфлікт: ${conflict.type}`);
		return false;
	}

	const professorExists: boolean = professors.some((p) => p.id === lesson.professorId);
	if (!professorExists) {
		console.log("Професор не знайдений");
		return false;
	}

	const courseExists: boolean = courses.some((c) => c.id === lesson.courseId);
	if (!courseExists) {
		console.log("Курс не знайдений");
		return false;
	}

	const classroomExists: boolean = classrooms.some((c) => c.number === lesson.classroomNumber);
	if (!classroomExists) {
		console.log("Аудиторія не знайдена");
		return false;
	}

	schedule.push(lesson);
	return true;
}

export function validateLesson(lesson: Lesson): ScheduleConflict | null {
	const professorConflict: Lesson | undefined = schedule.find(
		(existingLesson: Lesson) =>
			existingLesson.professorId === lesson.professorId &&
			existingLesson.dayOfWeek === lesson.dayOfWeek &&
			existingLesson.timeSlot === lesson.timeSlot &&
			existingLesson.id !== lesson.id,
	);

	if (professorConflict !== undefined) {
		return {
			type: "ProfessorConflict",
			lessonDetails: professorConflict,
		};
	}

	const classroomConflict: Lesson | undefined = schedule.find(
		(existingLesson: Lesson) =>
			existingLesson.classroomNumber === lesson.classroomNumber &&
			existingLesson.dayOfWeek === lesson.dayOfWeek &&
			existingLesson.timeSlot === lesson.timeSlot &&
			existingLesson.id !== lesson.id,
	);

	if (classroomConflict !== undefined) {
		return {
			type: "ClassroomConflict",
			lessonDetails: classroomConflict,
		};
	}

	return null;
}

export function getDaySchedule(dayOfWeek: DayOfWeek): Lesson[] {
	return schedule.filter((lesson: Lesson) => lesson.dayOfWeek === dayOfWeek);
}

export function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
	const lessonIndex: number = schedule.findIndex((lesson: Lesson) => lesson.id === lessonId);

	if (lessonIndex === -1) {
		console.log("Заняття не знайдено");
		return false;
	}

	const lesson: Lesson = schedule[lessonIndex];

	const classroomExists: boolean = classrooms.some((c) => c.number === newClassroomNumber);
	if (!classroomExists) {
		console.log("Нова аудиторія не знайдена");
		return false;
	}

	const tempLesson: Lesson = {
		...lesson,
		classroomNumber: newClassroomNumber,
	};

	const conflict: ScheduleConflict | null = validateLesson(tempLesson);

	if (conflict !== null && conflict.type === "ClassroomConflict") {
		console.log("Нова аудиторія зайнята в цей час");
		return false;
	}

	schedule[lessonIndex].classroomNumber = newClassroomNumber;
	return true;
}

export function cancelLesson(lessonId: number): void {
	const lessonIndex: number = schedule.findIndex((lesson: Lesson) => lesson.id === lessonId);

	if (lessonIndex === -1) {
		console.log("Заняття не знайдено");
		return;
	}

	schedule.splice(lessonIndex, 1);
	console.log(`Заняття ${lessonId} успішно скасовано`);
}
