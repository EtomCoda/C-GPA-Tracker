import { useState } from 'react';
import { Edit2, Trash2, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { Semester, Course } from '../types';
import { calculateSemesterGPA } from '../utils/gpaCalculations';
import { courseService } from '../services/database';
import CourseItem from './CourseItem';
import AddCourseModal from './AddCourseModal';
import EditSemesterModal from './EditSemesterModal';

interface SemesterCardProps {
  semester: Semester;
  onDelete: (id: string) => void;
  onUpdate: (semester: Semester) => void;
}

const SemesterCard = ({ semester, onDelete, onUpdate }: SemesterCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [courses, setCourses] = useState(semester.courses);

  const gpa = calculateSemesterGPA(courses);
  const totalCredits = courses.reduce((sum, course) => sum + course.creditHours, 0);

  const handleAddCourse = async (course: Omit<Course, 'id'>) => {
    try {
      const newCourse = await courseService.create(semester.id, course);
      const updatedCourses = [...courses, newCourse];
      setCourses(updatedCourses);
      const updatedSemester = {
        ...semester,
        courses: updatedCourses,
        gpa: calculateSemesterGPA(updatedCourses),
      };
      onUpdate(updatedSemester);
      setIsAddCourseOpen(false);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await courseService.delete(courseId);
      const updatedCourses = courses.filter(c => c.id !== courseId);
      setCourses(updatedCourses);
      const updatedSemester = {
        ...semester,
        courses: updatedCourses,
        gpa: calculateSemesterGPA(updatedCourses),
      };
      onUpdate(updatedSemester);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleUpdateCourse = async (updatedCourse: Course) => {
    try {
      await courseService.update(updatedCourse.id, updatedCourse);
      const updatedCourses = courses.map(c =>
        c.id === updatedCourse.id ? updatedCourse : c
      );
      setCourses(updatedCourses);
      const updatedSemester = {
        ...semester,
        courses: updatedCourses,
        gpa: calculateSemesterGPA(updatedCourses),
      };
      onUpdate(updatedSemester);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleUpdateSemesterName = (newName: string) => {
    onUpdate({ ...semester, name: newName, courses });
    setIsEditOpen(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {semester.name}
              </h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  GPA: {gpa.toFixed(2)}
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                  {totalCredits} Credits
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => setIsEditOpen(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="Edit semester name"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete ${semester.name}? This action cannot be undone.`)) {
                    onDelete(semester.id);
                  }
                }}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Delete semester"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Courses</h4>
                <button
                  onClick={() => setIsAddCourseOpen(true)}
                  className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Course
                </button>
              </div>

              {semester.courses.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400 mb-3">No courses added yet</p>
                  <button
                    onClick={() => setIsAddCourseOpen(true)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    Add your first course
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {semester.courses.map((course) => (
                    <CourseItem
                      key={course.id}
                      course={course}
                      onDelete={handleDeleteCourse}
                      onUpdate={handleUpdateCourse}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isAddCourseOpen && (
        <AddCourseModal
          onClose={() => setIsAddCourseOpen(false)}
          onAdd={handleAddCourse}
        />
      )}

      {isEditOpen && (
        <EditSemesterModal
          currentName={semester.name}
          onClose={() => setIsEditOpen(false)}
          onSave={handleUpdateSemesterName}
        />
      )}
    </>
  );
};

export default SemesterCard;
