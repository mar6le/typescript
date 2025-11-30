import { Lesson, Professor } from "../types/schedule.types.js";
import { professors, schedule } from "./data-storage.module.js";

export function addProfessor(professor: Professor): void {
	professors.push(professor);
}

export function getProfessorInfo(professorId: number): Professor | null {
	const professor: Professor | undefined = professors.find((p: Professor) => p.id === professorId);
	return professor !== undefined ? professor : null;
}

export function getProfessorSchedule(professorId: number): Lesson[] {
	return schedule.filter((lesson: Lesson) => lesson.professorId === professorId);
}
