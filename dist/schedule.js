"use strict";
const professors = [];
const classrooms = [];
const courses = [];
const schedule = [];
let lessonIdCounter = 1;
function addProfessor(professor) {
    professors.push(professor);
}
function addClassroom(classroom) {
    classrooms.push(classroom);
}
function addCourse(course) {
    courses.push(course);
}
function addLesson(lesson) {
    const conflict = validateLesson(lesson);
    if (conflict !== null) {
        console.log(`Конфлікт: ${conflict.type}`);
        return false;
    }
    const professorExists = professors.some((p) => p.id === lesson.professorId);
    if (!professorExists) {
        console.log("Професор не знайдений");
        return false;
    }
    const courseExists = courses.some((c) => c.id === lesson.courseId);
    if (!courseExists) {
        console.log("Курс не знайдений");
        return false;
    }
    const classroomExists = classrooms.some((c) => c.number === lesson.classroomNumber);
    if (!classroomExists) {
        console.log("Аудиторія не знайдена");
        return false;
    }
    schedule.push(lesson);
    return true;
}
function findAvailableClassrooms(timeSlot, dayOfWeek) {
    const occupiedClassrooms = schedule
        .filter((lesson) => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
        .map((lesson) => lesson.classroomNumber);
    return classrooms
        .filter((classroom) => !occupiedClassrooms.includes(classroom.number))
        .map((classroom) => classroom.number);
}
function getProfessorSchedule(professorId) {
    return schedule.filter((lesson) => lesson.professorId === professorId);
}
function getClassroomSchedule(classroomNumber) {
    return schedule.filter((lesson) => lesson.classroomNumber === classroomNumber);
}
function getDaySchedule(dayOfWeek) {
    return schedule.filter((lesson) => lesson.dayOfWeek === dayOfWeek);
}
function validateLesson(lesson) {
    const professorConflict = schedule.find((existingLesson) => existingLesson.professorId === lesson.professorId &&
        existingLesson.dayOfWeek === lesson.dayOfWeek &&
        existingLesson.timeSlot === lesson.timeSlot &&
        existingLesson.id !== lesson.id);
    if (professorConflict !== undefined) {
        return {
            type: "ProfessorConflict",
            lessonDetails: professorConflict,
        };
    }
    const classroomConflict = schedule.find((existingLesson) => existingLesson.classroomNumber === lesson.classroomNumber &&
        existingLesson.dayOfWeek === lesson.dayOfWeek &&
        existingLesson.timeSlot === lesson.timeSlot &&
        existingLesson.id !== lesson.id);
    if (classroomConflict !== undefined) {
        return {
            type: "ClassroomConflict",
            lessonDetails: classroomConflict,
        };
    }
    return null;
}
function getClassroomUtilization(classroomNumber) {
    const daysPerWeek = 5;
    const slotsPerDay = 5;
    const totalSlots = daysPerWeek * slotsPerDay;
    const occupiedSlots = schedule.filter((lesson) => lesson.classroomNumber === classroomNumber).length;
    const utilization = (occupiedSlots / totalSlots) * 100;
    return Math.round(utilization * 100) / 100;
}
function getMostPopularCourseType() {
    const courseTypeCounts = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0,
    };
    schedule.forEach((lesson) => {
        const course = courses.find((c) => c.id === lesson.courseId);
        if (course !== undefined) {
            courseTypeCounts[course.type]++;
        }
    });
    let maxCount = 0;
    let mostPopular = "Lecture";
    const types = ["Lecture", "Seminar", "Lab", "Practice"];
    types.forEach((type) => {
        if (courseTypeCounts[type] > maxCount) {
            maxCount = courseTypeCounts[type];
            mostPopular = type;
        }
    });
    return mostPopular;
}
function getCourseTypeStatistics() {
    const stats = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0,
    };
    schedule.forEach((lesson) => {
        const course = courses.find((c) => c.id === lesson.courseId);
        if (course !== undefined) {
            stats[course.type]++;
        }
    });
    return stats;
}
function reassignClassroom(lessonId, newClassroomNumber) {
    const lessonIndex = schedule.findIndex((lesson) => lesson.id === lessonId);
    if (lessonIndex === -1) {
        console.log("Заняття не знайдено");
        return false;
    }
    const lesson = schedule[lessonIndex];
    const classroomExists = classrooms.some((c) => c.number === newClassroomNumber);
    if (!classroomExists) {
        console.log("Нова аудиторія не знайдена");
        return false;
    }
    const tempLesson = Object.assign(Object.assign({}, lesson), { classroomNumber: newClassroomNumber });
    const conflict = validateLesson(tempLesson);
    if (conflict !== null && conflict.type === "ClassroomConflict") {
        console.log("Нова аудиторія зайнята в цей час");
        return false;
    }
    schedule[lessonIndex].classroomNumber = newClassroomNumber;
    return true;
}
function cancelLesson(lessonId) {
    const lessonIndex = schedule.findIndex((lesson) => lesson.id === lessonId);
    if (lessonIndex === -1) {
        console.log("Заняття не знайдено");
        return;
    }
    schedule.splice(lessonIndex, 1);
    console.log(`Заняття ${lessonId} успішно скасовано`);
}
function createLesson(courseId, professorId, classroomNumber, dayOfWeek, timeSlot) {
    const lesson = {
        id: lessonIdCounter++,
        courseId,
        professorId,
        classroomNumber,
        dayOfWeek,
        timeSlot,
    };
    return lesson;
}
function getProfessorInfo(professorId) {
    const professor = professors.find((p) => p.id === professorId);
    return professor !== undefined ? professor : null;
}
function getCourseInfo(courseId) {
    const course = courses.find((c) => c.id === courseId);
    return course !== undefined ? course : null;
}
function getClassroomInfo(classroomNumber) {
    const classroom = classrooms.find((c) => c.number === classroomNumber);
    return classroom !== undefined ? classroom : null;
}
function printFullSchedule() {
    console.log("\n=== ПОВНИЙ РОЗКЛАД ===\n");
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    days.forEach((day) => {
        console.log(`\n${day}:`);
        const dayLessons = getDaySchedule(day);
        if (dayLessons.length === 0) {
            console.log("  Немає занять");
        }
        else {
            dayLessons.forEach((lesson) => {
                const course = getCourseInfo(lesson.courseId);
                const professor = getProfessorInfo(lesson.professorId);
                console.log(`  ${lesson.timeSlot} - ${course === null || course === void 0 ? void 0 : course.name} (${course === null || course === void 0 ? void 0 : course.type}) - ${professor === null || professor === void 0 ? void 0 : professor.name} - Ауд. ${lesson.classroomNumber}`);
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
const lesson1 = createLesson(1, 1, "101", "Monday", "8:30-10:00");
console.log(`Додавання заняття 1: ${addLesson(lesson1)}`);
const lesson2 = createLesson(2, 1, "301", "Monday", "10:15-11:45");
console.log(`Додавання заняття 2: ${addLesson(lesson2)}`);
const lesson3 = createLesson(3, 2, "102", "Tuesday", "8:30-10:00");
console.log(`Додавання заняття 3: ${addLesson(lesson3)}`);
const lesson4 = createLesson(4, 3, "201", "Wednesday", "12:15-13:45");
console.log(`Додавання заняття 4: ${addLesson(lesson4)}`);
const lesson5 = createLesson(5, 1, "101", "Thursday", "14:00-15:30");
console.log(`Додавання заняття 5: ${addLesson(lesson5)}`);
const conflictLesson = createLesson(3, 1, "102", "Monday", "8:30-10:00");
console.log(`\nСпроба додати заняття з конфліктом професора: ${addLesson(conflictLesson)}`);
const classroomConflict = createLesson(4, 2, "101", "Monday", "8:30-10:00");
console.log(`Спроба додати заняття з конфліктом аудиторії: ${addLesson(classroomConflict)}`);
console.log(`\nВсього занять у розкладі: ${schedule.length}`);
console.log("\n=== ПОШУК ВІЛЬНИХ АУДИТОРІЙ ===\n");
const availableRooms = findAvailableClassrooms("8:30-10:00", "Monday");
console.log(`Вільні аудиторії в понеділок 8:30-10:00: ${availableRooms.join(", ")}`);
console.log("\n=== РОЗКЛАД ПРОФЕСОРА ===\n");
const profSchedule = getProfessorSchedule(1);
console.log(`Розклад професора ${professors[0].name}:`);
profSchedule.forEach((lesson) => {
    const course = getCourseInfo(lesson.courseId);
    console.log(`  ${lesson.dayOfWeek} ${lesson.timeSlot} - ${course === null || course === void 0 ? void 0 : course.name} - Ауд. ${lesson.classroomNumber}`);
});
console.log("\n=== ВИКОРИСТАННЯ АУДИТОРІЙ ===\n");
classrooms.forEach((classroom) => {
    const utilization = getClassroomUtilization(classroom.number);
    console.log(`Аудиторія ${classroom.number}: ${utilization}% використання`);
});
console.log("\n=== СТАТИСТИКА ТИПІВ ЗАНЯТЬ ===\n");
const stats = getCourseTypeStatistics();
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
