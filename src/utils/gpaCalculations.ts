import { Course, Semester } from '../types';
import { GRADE_POINTS } from './gradePoints';

export const calculateSemesterGPA = (courses: Course[]): number => {
  if (courses.length === 0) return 0;

  const totalPoints = courses.reduce((sum, course) => {
    return sum + (GRADE_POINTS[course.grade] * course.creditHours);
  }, 0);

  const totalCredits = courses.reduce((sum, course) => sum + course.creditHours, 0);

  if (totalCredits === 0) return 0;

  return totalPoints / totalCredits;
};

export const calculateCGPA = (semesters: Semester[]): number => {
  if (semesters.length === 0) return 0;

  const allCourses = semesters.flatMap(semester => semester.courses);
  return calculateSemesterGPA(allCourses);
};

export const getTotalCredits = (semesters: Semester[]): number => {
  return semesters.reduce((total, semester) => {
    return total + semester.courses.reduce((sum, course) => sum + course.creditHours, 0);
  }, 0);
};

export const calculateProjectedCGPA = (
  currentCGPA: number,
  currentCredits: number,
  newCourses: Course[]
): number => {
  if (newCourses.length === 0) return currentCGPA;

  const currentPoints = currentCGPA * currentCredits;
  const newPoints = newCourses.reduce((sum, course) => {
    return sum + (GRADE_POINTS[course.grade] * course.creditHours);
  }, 0);
  const newCredits = newCourses.reduce((sum, course) => sum + course.creditHours, 0);

  const totalCredits = currentCredits + newCredits;
  if (totalCredits === 0) return 0;

  return (currentPoints + newPoints) / totalCredits;
};
