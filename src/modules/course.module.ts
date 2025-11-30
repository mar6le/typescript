import { Course, CourseType } from "../types/schedule.types.js";
import { courses, schedule } from "./data-storage.module.js";

export function addCourse(course: Course): void {
	courses.push(course);
}

export function getCourseInfo(courseId: number): Course | null {
	const course: Course | undefined = courses.find((c: Course) => c.id === courseId);
	return course !== undefined ? course : null;
}

export function getMostPopularCourseType(): CourseType {
	const courseTypeCounts: { [key: string]: number } = {
		Lecture: 0,
		Seminar: 0,
		Lab: 0,
		Practice: 0,
	};

	schedule.forEach((lesson) => {
		const course: Course | undefined = courses.find((c: Course) => c.id === lesson.courseId);
		if (course !== undefined) {
			courseTypeCounts[course.type]++;
		}
	});

	let maxCount: number = 0;
	let mostPopular: CourseType = "Lecture";

	const types: CourseType[] = ["Lecture", "Seminar", "Lab", "Practice"];
	types.forEach((type: CourseType) => {
		if (courseTypeCounts[type] > maxCount) {
			maxCount = courseTypeCounts[type];
			mostPopular = type;
		}
	});

	return mostPopular;
}

export function getCourseTypeStatistics(): { [key: string]: number } {
	const stats: { [key: string]: number } = {
		Lecture: 0,
		Seminar: 0,
		Lab: 0,
		Practice: 0,
	};

	schedule.forEach((lesson) => {
		const course: Course | undefined = courses.find((c: Course) => c.id === lesson.courseId);
		if (course !== undefined) {
			stats[course.type]++;
		}
	});

	return stats;
}
