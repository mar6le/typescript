enum StudentStatus {
	Active = "Active",
	Academic_Leave = "Academic_Leave",
	Graduated = "Graduated",
	Expelled = "Expelled",
}

enum CourseType {
	Mandatory = "Mandatory",
	Optional = "Optional",
	Special = "Special",
}

enum Semester {
	First = "First",
	Second = "Second",
}

enum GradeValue {
	Excellent = 5,
	Good = 4,
	Satisfactory = 3,
	Unsatisfactory = 2,
}

enum Faculty {
	Computer_Science = "Computer_Science",
	Economics = "Economics",
	Law = "Law",
	Engineering = "Engineering",
}

interface Student {
	id: number;
	fullName: string;
	faculty: Faculty;
	year: number;
	status: StudentStatus;
	enrollmentDate: Date;
	groupNumber: string;
}

interface Course {
	id: number;
	name: string;
	type: CourseType;
	credits: number;
	semester: Semester;
	faculty: Faculty;
	maxStudents: number;
}

interface Grade {
	studentId: number;
	courseId: number;
	grade: GradeValue;
	date: Date;
	semester: Semester;
}

interface CourseRegistration {
	studentId: number;
	courseId: number;
	registrationDate: Date;
}

class UniversityManagementSystem {
	private students: Student[] = [];
	private courses: Course[] = [];
	private grades: Grade[] = [];
	private courseRegistrations: CourseRegistration[] = [];
	private studentIdCounter: number = 1;

	public enrollStudent(student: Omit<Student, "id">): Student {
		const newStudent: Student = {
			id: this.studentIdCounter++,
			...student,
		};

		this.students.push(newStudent);
		console.log(`Студент ${newStudent.fullName} зарахований з ID: ${newStudent.id}`);
		return newStudent;
	}

	public registerForCourse(studentId: number, courseId: number): void {
		const student: Student | undefined = this.students.find((s: Student) => s.id === studentId);
		if (!student) {
			console.log(`Студент з ID ${studentId} не знайдений`);
			return;
		}

		if (student.status !== StudentStatus.Active) {
			console.log(`Студент ${student.fullName} не має активного статусу`);
			return;
		}

		const course: Course | undefined = this.courses.find((c: Course) => c.id === courseId);
		if (!course) {
			console.log(`Курс з ID ${courseId} не знайдений`);
			return;
		}

		if (student.faculty !== course.faculty) {
			console.log(`Студент факультету ${student.faculty} не може зареєструватися на курс факультету ${course.faculty}`);
			return;
		}

		const isAlreadyRegistered: boolean = this.courseRegistrations.some(
			(reg: CourseRegistration) => reg.studentId === studentId && reg.courseId === courseId,
		);

		if (isAlreadyRegistered) {
			console.log(`Студент ${student.fullName} вже зареєстрований на курс ${course.name}`);
			return;
		}

		const registeredStudentsCount: number = this.courseRegistrations.filter(
			(reg: CourseRegistration) => reg.courseId === courseId,
		).length;

		if (registeredStudentsCount >= course.maxStudents) {
			console.log(`Курс ${course.name} заповнений (максимум ${course.maxStudents} студентів)`);
			return;
		}

		this.courseRegistrations.push({
			studentId,
			courseId,
			registrationDate: new Date(),
		});

		console.log(`Студент ${student.fullName} зареєстрований на курс ${course.name}`);
	}

	public setGrade(studentId: number, courseId: number, grade: GradeValue): void {
		const student: Student | undefined = this.students.find((s: Student) => s.id === studentId);
		if (!student) {
			console.log(`Студент з ID ${studentId} не знайдений`);
			return;
		}

		const course: Course | undefined = this.courses.find((c: Course) => c.id === courseId);
		if (!course) {
			console.log(`Курс з ID ${courseId} не знайдений`);
			return;
		}

		const isRegistered: boolean = this.courseRegistrations.some(
			(reg: CourseRegistration) => reg.studentId === studentId && reg.courseId === courseId,
		);

		if (!isRegistered) {
			console.log(`Студент ${student.fullName} не зареєстрований на курс ${course.name}`);
			return;
		}

		const existingGradeIndex: number = this.grades.findIndex(
			(g: Grade) => g.studentId === studentId && g.courseId === courseId,
		);

		const newGrade: Grade = {
			studentId,
			courseId,
			grade,
			date: new Date(),
			semester: course.semester,
		};

		if (existingGradeIndex !== -1) {
			this.grades[existingGradeIndex] = newGrade;
			console.log(`Оцінка оновлена для студента ${student.fullName} з курсу ${course.name}: ${grade}`);
		} else {
			this.grades.push(newGrade);
			console.log(`Оцінка виставлена для студента ${student.fullName} з курсу ${course.name}: ${grade}`);
		}
	}

	public updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
		const student: Student | undefined = this.students.find((s: Student) => s.id === studentId);
		if (!student) {
			console.log(`Студент з ID ${studentId} не знайдений`);
			return;
		}

		const oldStatus: StudentStatus = student.status;

		if (oldStatus === StudentStatus.Graduated && newStatus !== StudentStatus.Graduated) {
			console.log(`Неможливо змінити статус випускника`);
			return;
		}

		if (oldStatus === StudentStatus.Expelled && newStatus === StudentStatus.Active) {
			console.log(`Неможливо повернути статус Active після відрахування`);
			return;
		}

		student.status = newStatus;
		console.log(`Статус студента ${student.fullName} змінено з ${oldStatus} на ${newStatus}`);
	}

	public getStudentsByFaculty(faculty: Faculty): Student[] {
		return this.students.filter((student: Student) => student.faculty === faculty);
	}

	public getStudentGrades(studentId: number): Grade[] {
		return this.grades.filter((grade: Grade) => grade.studentId === studentId);
	}

	public getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
		return this.courses.filter((course: Course) => course.faculty === faculty && course.semester === semester);
	}

	public calculateAverageGrade(studentId: number): number {
		const studentGrades: Grade[] = this.getStudentGrades(studentId);

		if (studentGrades.length === 0) {
			return 0;
		}

		const sum: number = studentGrades.reduce((total: number, grade: Grade) => total + grade.grade, 0);
		return Math.round((sum / studentGrades.length) * 100) / 100;
	}

	public getTopStudentsByFaculty(faculty: Faculty): Student[] {
		const facultyStudents: Student[] = this.getStudentsByFaculty(faculty);

		const excellentStudents: Student[] = facultyStudents.filter((student: Student) => {
			const studentGrades: Grade[] = this.getStudentGrades(student.id);

			if (studentGrades.length === 0) {
				return false;
			}

			const allExcellent: boolean = studentGrades.every((grade: Grade) => grade.grade === GradeValue.Excellent);
			return allExcellent;
		});

		return excellentStudents;
	}

	public addCourse(course: Course): void {
		this.courses.push(course);
		console.log(`Курс ${course.name} додано`);
	}

	public getStudentById(studentId: number): Student | undefined {
		return this.students.find((s: Student) => s.id === studentId);
	}

	public getCourseById(courseId: number): Course | undefined {
		return this.courses.find((c: Course) => c.id === courseId);
	}

	public getStudentCourses(studentId: number): Course[] {
		const studentRegistrations: CourseRegistration[] = this.courseRegistrations.filter(
			(reg: CourseRegistration) => reg.studentId === studentId,
		);

		return studentRegistrations
			.map((reg: CourseRegistration) => this.getCourseById(reg.courseId))
			.filter((course: Course | undefined): course is Course => course !== undefined);
	}

	public getCourseStatistics(courseId: number): {
		totalStudents: number;
		averageGrade: number;
		gradeDistribution: { [key: number]: number };
	} {
		const courseGrades: Grade[] = this.grades.filter((grade: Grade) => grade.courseId === courseId);

		const gradeDistribution: { [key: number]: number } = {
			5: 0,
			4: 0,
			3: 0,
			2: 0,
		};

		courseGrades.forEach((grade: Grade) => {
			gradeDistribution[grade.grade]++;
		});

		const averageGrade: number =
			courseGrades.length > 0
				? courseGrades.reduce((sum: number, grade: Grade) => sum + grade.grade, 0) / courseGrades.length
				: 0;

		return {
			totalStudents: courseGrades.length,
			averageGrade: Math.round(averageGrade * 100) / 100,
			gradeDistribution,
		};
	}
}

console.log("=== СИСТЕМА УПРАВЛІННЯ УНІВЕРСИТЕТОМ ===\n");

const university: UniversityManagementSystem = new UniversityManagementSystem();

console.log("=== ДОДАВАННЯ КУРСІВ ===\n");

university.addCourse({
	id: 1,
	name: "Програмування на TypeScript",
	type: CourseType.Mandatory,
	credits: 5,
	semester: Semester.First,
	faculty: Faculty.Computer_Science,
	maxStudents: 30,
});

university.addCourse({
	id: 2,
	name: "Алгоритми та структури даних",
	type: CourseType.Mandatory,
	credits: 6,
	semester: Semester.Second,
	faculty: Faculty.Computer_Science,
	maxStudents: 30,
});

university.addCourse({
	id: 3,
	name: "Бази даних",
	type: CourseType.Optional,
	credits: 4,
	semester: Semester.First,
	faculty: Faculty.Computer_Science,
	maxStudents: 25,
});

university.addCourse({
	id: 4,
	name: "Мікроекономіка",
	type: CourseType.Mandatory,
	credits: 5,
	semester: Semester.First,
	faculty: Faculty.Economics,
	maxStudents: 40,
});

console.log("\n=== ЗАРАХУВАННЯ СТУДЕНТІВ ===\n");

const student1: Student = university.enrollStudent({
	fullName: "Іваненко Іван Іванович",
	faculty: Faculty.Computer_Science,
	year: 1,
	status: StudentStatus.Active,
	enrollmentDate: new Date("2024-09-01"),
	groupNumber: "КН-101",
});

const student2: Student = university.enrollStudent({
	fullName: "Петренко Марія Петрівна",
	faculty: Faculty.Computer_Science,
	year: 1,
	status: StudentStatus.Active,
	enrollmentDate: new Date("2024-09-01"),
	groupNumber: "КН-101",
});

const student3: Student = university.enrollStudent({
	fullName: "Сидоренко Олег Васильович",
	faculty: Faculty.Economics,
	year: 2,
	status: StudentStatus.Active,
	enrollmentDate: new Date("2023-09-01"),
	groupNumber: "ЕК-201",
});

console.log("\n=== РЕЄСТРАЦІЯ НА КУРСИ ===\n");

university.registerForCourse(student1.id, 1);
university.registerForCourse(student1.id, 3);
university.registerForCourse(student2.id, 1);
university.registerForCourse(student2.id, 3);
university.registerForCourse(student3.id, 4);

console.log("\n=== СПРОБА РЕЄСТРАЦІЇ НА КУРС ІНШОГО ФАКУЛЬТЕТУ ===\n");
university.registerForCourse(student1.id, 4);

console.log("\n=== ВИСТАВЛЕННЯ ОЦІНОК ===\n");

university.setGrade(student1.id, 1, GradeValue.Excellent);
university.setGrade(student1.id, 3, GradeValue.Excellent);
university.setGrade(student2.id, 1, GradeValue.Good);
university.setGrade(student2.id, 3, GradeValue.Excellent);
university.setGrade(student3.id, 4, GradeValue.Satisfactory);

console.log("\n=== СПРОБА ВИСТАВИТИ ОЦІНКУ БЕЗ РЕЄСТРАЦІЇ ===\n");
university.setGrade(student1.id, 2, GradeValue.Excellent);

console.log("\n=== СЕРЕДНІЙ БАЛ СТУДЕНТІВ ===\n");

console.log(`Середній бал ${student1.fullName}: ${university.calculateAverageGrade(student1.id)}`);
console.log(`Середній бал ${student2.fullName}: ${university.calculateAverageGrade(student2.id)}`);
console.log(`Середній бал ${student3.fullName}: ${university.calculateAverageGrade(student3.id)}`);

console.log("\n=== ВІДМІННИКИ ФАКУЛЬТЕТУ COMPUTER SCIENCE ===\n");

const topStudents: Student[] = university.getTopStudentsByFaculty(Faculty.Computer_Science);
console.log(`Кількість відмінників: ${topStudents.length}`);
topStudents.forEach((student: Student) => {
	console.log(`  - ${student.fullName}, група ${student.groupNumber}`);
});

console.log("\n=== ЗМІНА СТАТУСУ СТУДЕНТА ===\n");

university.updateStudentStatus(student3.id, StudentStatus.Academic_Leave);
console.log(`Поточний статус ${student3.fullName}: ${university.getStudentById(student3.id)?.status}`);

console.log("\n=== СПРОБА РЕЄСТРАЦІЇ СТУДЕНТА В АКАДЕМІЧНІЙ ВІДПУСТЦІ ===\n");
university.registerForCourse(student3.id, 4);

console.log("\n=== ДОСТУПНІ КУРСИ ===\n");

const availableCourses: Course[] = university.getAvailableCourses(Faculty.Computer_Science, Semester.First);
console.log(`Курси для Computer Science (${Semester.First} семестр):`);
availableCourses.forEach((course: Course) => {
	console.log(`  - ${course.name} (${course.type}, ${course.credits} кредитів)`);
});

console.log("\n=== СТАТИСТИКА КУРСУ ===\n");

const courseStats = university.getCourseStatistics(1);
console.log("Статистика курсу 'Програмування на TypeScript':");
console.log(`  Студентів: ${courseStats.totalStudents}`);
console.log(`  Середній бал: ${courseStats.averageGrade}`);
console.log(`  Розподіл оцінок:`);
console.log(`    Відмінно (5): ${courseStats.gradeDistribution[5]}`);
console.log(`    Добре (4): ${courseStats.gradeDistribution[4]}`);
console.log(`    Задовільно (3): ${courseStats.gradeDistribution[3]}`);
console.log(`    Незадовільно (2): ${courseStats.gradeDistribution[2]}`);

console.log("\n=== СИСТЕМА ПРАЦЮЄ КОРЕКТНО ===");
