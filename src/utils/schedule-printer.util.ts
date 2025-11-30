import { getCourseInfo } from "../modules/course.module.js";
import { getDaySchedule } from "../modules/lesson.module.js";
import { getProfessorInfo } from "../modules/professor.module.js";
import { Course, DayOfWeek, Lesson, Professor } from "../types/schedule.types.js";

export function printFullSchedule(): void {
	console.log("\n=== ПОВНИЙ РОЗКЛАД ===\n");

	const days: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

	days.forEach((day: DayOfWeek) => {
		console.log(`\n${day}:`);
		const dayLessons: Lesson[] = getDaySchedule(day);

		if (dayLessons.length === 0) {
			console.log("  Немає занять");
		} else {
			dayLessons.forEach((lesson: Lesson) => {
				const course: Course | null = getCourseInfo(lesson.courseId);
				const professor: Professor | null = getProfessorInfo(lesson.professorId);

				console.log(
					`  ${lesson.timeSlot} - ${course?.name} (${course?.type}) - ${professor?.name} - Ауд. ${lesson.classroomNumber}`,
				);
			});
		}
	});
}
