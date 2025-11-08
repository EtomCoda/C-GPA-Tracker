import { Grade } from '../types';

export const GRADE_POINTS: Record<Grade, number> = {
  'A': 5.0,
  'A-': 4.7,
  'B+': 4.3,
  'B': 4.0,
  'B-': 3.7,
  'C+': 3.3,
  'C': 3.0,
  'C-': 2.7,
  'D+': 2.3,
  'D': 2.0,
  'F': 0.0,
};

export const GRADES: Grade[] = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];
