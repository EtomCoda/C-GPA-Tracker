import { Semester, GoalData } from '../types';

const SEMESTERS_KEY = 'gpa_tracker_semesters';
const GOAL_KEY = 'gpa_tracker_goal';
const THEME_KEY = 'gpa_tracker_theme';

export const loadSemesters = (): Semester[] => {
  try {
    const data = localStorage.getItem(SEMESTERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error loading semesters:', error);
    }
    return [];
  }
};

export const saveSemesters = (semesters: Semester[]): void => {
  try {
    localStorage.setItem(SEMESTERS_KEY, JSON.stringify(semesters));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error saving semesters:', error);
    }
  }
};

export const loadGoal = (): GoalData | null => {
  try {
    const data = localStorage.getItem(GOAL_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error loading goal:', error);
    }
    return null;
  }
};

export const saveGoal = (goal: GoalData): void => {
  try {
    localStorage.setItem(GOAL_KEY, JSON.stringify(goal));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error saving goal:', error);
    }
  }
};

export const loadTheme = (): 'light' | 'dark' => {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    return (theme as 'light' | 'dark') || 'dark';
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error loading theme:', error);
    }
    return 'light';
  }
};

export const saveTheme = (theme: 'light' | 'dark'): void => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error saving theme:', error);
    }
  }
};
