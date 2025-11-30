import { addClassroom, findAvailableClassrooms, getClassroomUtilization } from "./modules/classroom.module.js";
import {
	addCourse,
	getCourseInfo,
	getCourseTypeStatistics,
	getMostPopularCourseType,
} from "./modules/course.module.js";
import { classrooms, professors, schedule } from "./modules/data-storage.module.js";
import { addLesson, cancelLesson, createLesson, reassignClassroom } from "./modules/lesson.module.js";
import { addProfessor, getProfessorSchedule } from "./modules/professor.module.js";
import { Classroom, Lesson } from "./types/schedule.types.js";
import { printFullSchedule } from "./utils/schedule-printer.util.js";

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

console.log(`Додано ${classrooms.length} курсів\n`);

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
	const course = getCourseInfo(lesson.courseId);
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
