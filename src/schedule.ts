type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
type TimeSlot = "8:30-10:00" | "10:15-11:45" | "12:15-13:45" | "14:00-15:30" | "15:45-17:15";
type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

type Professor = {
	id: number;
	name: string;
	department: string;
};

type Classroom = {
	number: string;
	capacity: number;
	hasProjector: boolean;
};

type Course = {
	id: number;
	name: string;
	type: CourseType;
};

type Lesson = {
	id: number;
	courseId: number;
	professorId: number;
	classroomNumber: string;
	dayOfWeek: DayOfWeek;
	timeSlot: TimeSlot;
};

const professors: Professor[] = [];
const classrooms: Classroom[] = [];
const courses: Course[] = [];
const schedule: Lesson[] = [];

let lessonIdCounter: number = 1;

function addProfessor(professor: Professor): void {
	professors.push(professor);
}

function addClassroom(classroom: Classroom): void {
	classrooms.push(classroom);
}

function addCourse(course: Course): void {
	courses.push(course);
}

function addLesson(lesson: Lesson): boolean {
	const conflict: ScheduleConflict | null = validateLesson(lesson);

	if (conflict !== null) {
		console.log(`Конфлікт: ${conflict.type}`);
		return false;
	}

	const professorExists: boolean = professors.some((p: Professor) => p.id === lesson.professorId);
	if (!professorExists) {
		console.log("Професор не знайдений");
		return false;
	}

	const courseExists: boolean = courses.some((c: Course) => c.id === lesson.courseId);
	if (!courseExists) {
		console.log("Курс не знайдений");
		return false;
	}

	const classroomExists: boolean = classrooms.some((c: Classroom) => c.number === lesson.classroomNumber);
	if (!classroomExists) {
		console.log("Аудиторія не знайдена");
		return false;
	}

	schedule.push(lesson);
	return true;
}

function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
	const occupiedClassrooms: string[] = schedule
		.filter((lesson: Lesson) => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
		.map((lesson: Lesson) => lesson.classroomNumber);

	return classrooms
		.filter((classroom: Classroom) => !occupiedClassrooms.includes(classroom.number))
		.map((classroom: Classroom) => classroom.number);
}

function getProfessorSchedule(professorId: number): Lesson[] {
	return schedule.filter((lesson: Lesson) => lesson.professorId === professorId);
}

function getClassroomSchedule(classroomNumber: string): Lesson[] {
	return schedule.filter((lesson: Lesson) => lesson.classroomNumber === classroomNumber);
}

function getDaySchedule(dayOfWeek: DayOfWeek): Lesson[] {
	return schedule.filter((lesson: Lesson) => lesson.dayOfWeek === dayOfWeek);
}

type ScheduleConflict = {
	type: "ProfessorConflict" | "ClassroomConflict";
	lessonDetails: Lesson;
};

function validateLesson(lesson: Lesson): ScheduleConflict | null {
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

function getClassroomUtilization(classroomNumber: string): number {
	const daysPerWeek: number = 5;
	const slotsPerDay: number = 5;
	const totalSlots: number = daysPerWeek * slotsPerDay;

	const occupiedSlots: number = schedule.filter((lesson: Lesson) => lesson.classroomNumber === classroomNumber).length;

	const utilization: number = (occupiedSlots / totalSlots) * 100;

	return Math.round(utilization * 100) / 100;
}

function getMostPopularCourseType(): CourseType {
	const courseTypeCounts: { [key: string]: number } = {
		Lecture: 0,
		Seminar: 0,
		Lab: 0,
		Practice: 0,
	};

	schedule.forEach((lesson: Lesson) => {
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

function getCourseTypeStatistics(): { [key: string]: number } {
	const stats: { [key: string]: number } = {
		Lecture: 0,
		Seminar: 0,
		Lab: 0,
		Practice: 0,
	};

	schedule.forEach((lesson: Lesson) => {
		const course: Course | undefined = courses.find((c: Course) => c.id === lesson.courseId);
		if (course !== undefined) {
			stats[course.type]++;
		}
	});

	return stats;
}

function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
	const lessonIndex: number = schedule.findIndex((lesson: Lesson) => lesson.id === lessonId);

	if (lessonIndex === -1) {
		console.log("Заняття не знайдено");
		return false;
	}

	const lesson: Lesson = schedule[lessonIndex];

	const classroomExists: boolean = classrooms.some((c: Classroom) => c.number === newClassroomNumber);
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

function cancelLesson(lessonId: number): void {
	const lessonIndex: number = schedule.findIndex((lesson: Lesson) => lesson.id === lessonId);

	if (lessonIndex === -1) {
		console.log("Заняття не знайдено");
		return;
	}

	schedule.splice(lessonIndex, 1);
	console.log(`Заняття ${lessonId} успішно скасовано`);
}

function createLesson(
	courseId: number,
	professorId: number,
	classroomNumber: string,
	dayOfWeek: DayOfWeek,
	timeSlot: TimeSlot,
): Lesson {
	const lesson: Lesson = {
		id: lessonIdCounter++,
		courseId,
		professorId,
		classroomNumber,
		dayOfWeek,
		timeSlot,
	};
	return lesson;
}

function getProfessorInfo(professorId: number): Professor | null {
	const professor: Professor | undefined = professors.find((p: Professor) => p.id === professorId);
	return professor !== undefined ? professor : null;
}

function getCourseInfo(courseId: number): Course | null {
	const course: Course | undefined = courses.find((c: Course) => c.id === courseId);
	return course !== undefined ? course : null;
}

function getClassroomInfo(classroomNumber: string): Classroom | null {
	const classroom: Classroom | undefined = classrooms.find((c: Classroom) => c.number === classroomNumber);
	return classroom !== undefined ? classroom : null;
}

function printFullSchedule(): void {
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

console.log("=== СИСТЕМА УПРАВЛІННЯ РОЗКЛАДОМ УНІВЕРСИТЕТУ ===\n");

addProfessor({ id: 1, name: "Іванов Іван Іванович", department: "Кафедра програмування" });
addProfessor({ id: 2, name: "Петрова Марія Петрівна", department: "Кафедра математики" });
addProfessor({ id: 3, name: "Сидоренко Олег Васильович", department: "Кафедра фізики" });

console.log(`Додано ${professors.length} професорів`);

addClassroom({ number: "101", capacity: 30, hasProjector: true });
addClassroom({ number: "102", capacity: 50, hasProjector: true });
addClassroom({ number: "201", capacity: 25, hasProjector: false });
addClassroom({ number: "301", capacity: 40, hasProjector: true });

console.log(`Додано ${classrooms.length} аудиторій`);

addCourse({ id: 1, name: "Основи програмування", type: "Lecture" });
addCourse({ id: 2, name: "Алгоритми та структури даних", type: "Lab" });
addCourse({ id: 3, name: "Вища математика", type: "Seminar" });
addCourse({ id: 4, name: "Фізика", type: "Practice" });
addCourse({ id: 5, name: "TypeScript розробка", type: "Lecture" });

console.log(`Додано ${courses.length} курсів\n`);

console.log("=== ДОДАВАННЯ ЗАНЯТЬ ===\n");

const lesson1: Lesson = createLesson(1, 1, "101", "Monday", "8:30-10:00");
console.log(`Додавання заняття 1: ${addLesson(lesson1)}`);

const lesson2: Lesson = createLesson(2, 1, "301", "Monday", "10:15-11:45");
console.log(`Додавання заняття 2: ${addLesson(lesson2)}`);

const lesson3: Lesson = createLesson(3, 2, "102", "Tuesday", "8:30-10:00");
console.log(`Додавання заняття 3: ${addLesson(lesson3)}`);

const lesson4: Lesson = createLesson(4, 3, "201", "Wednesday", "12:15-13:45");
console.log(`Додавання заняття 4: ${addLesson(lesson4)}`);

const lesson5: Lesson = createLesson(5, 1, "101", "Thursday", "14:00-15:30");
console.log(`Додавання заняття 5: ${addLesson(lesson5)}`);

const conflictLesson: Lesson = createLesson(3, 1, "102", "Monday", "8:30-10:00");
console.log(`\nСпроба додати заняття з конфліктом професора: ${addLesson(conflictLesson)}`);

const classroomConflict: Lesson = createLesson(4, 2, "101", "Monday", "8:30-10:00");
console.log(`Спроба додати заняття з конфліктом аудиторії: ${addLesson(classroomConflict)}`);

console.log(`\nВсього занять у розкладі: ${schedule.length}`);

console.log("\n=== ПОШУК ВІЛЬНИХ АУДИТОРІЙ ===\n");
const availableRooms: string[] = findAvailableClassrooms("8:30-10:00", "Monday");
console.log(`Вільні аудиторії в понеділок 8:30-10:00: ${availableRooms.join(", ")}`);

console.log("\n=== РОЗКЛАД ПРОФЕСОРА ===\n");
const profSchedule: Lesson[] = getProfessorSchedule(1);
console.log(`Розклад професора ${professors[0].name}:`);
profSchedule.forEach((lesson: Lesson) => {
	const course: Course | null = getCourseInfo(lesson.courseId);
	console.log(`  ${lesson.dayOfWeek} ${lesson.timeSlot} - ${course?.name} - Ауд. ${lesson.classroomNumber}`);
});

console.log("\n=== ВИКОРИСТАННЯ АУДИТОРІЙ ===\n");
classrooms.forEach((classroom: Classroom) => {
	const utilization: number = getClassroomUtilization(classroom.number);
	console.log(`Аудиторія ${classroom.number}: ${utilization}% використання`);
});

console.log("\n=== СТАТИСТИКА ТИПІВ ЗАНЯТЬ ===\n");
const stats: { [key: string]: number } = getCourseTypeStatistics();
console.log(`Лекції: ${stats.Lecture}`);
console.log(`Семінари: ${stats.Seminar}`);
console.log(`Лабораторні: ${stats.Lab}`);
console.log(`Практики: ${stats.Practice}`);
console.log(`\nНайпопулярніший тип занять: ${getMostPopularCourseType()}`);

console.log("\n=== ЗМІНА АУДИТОРІЇ ===\n");
console.log(`Зміна аудиторії для заняття 1 на 102: ${reassignClassroom(1, "102")}`);
console.log(`Зміна аудиторії для заняття 1 на 201: ${reassignClassroom(1, "201")}`);

console.log("\n=== СКАСУВАННЯ ЗАНЯТТЯ ===\n");
cancelLesson(5);
console.log(`Залишилось занять у розкладі: ${schedule.length}`);

printFullSchedule();

console.log("\n=== СИСТЕМА ПРАЦЮЄ КОРЕКТНО ===");
