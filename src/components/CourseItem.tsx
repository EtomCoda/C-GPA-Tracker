import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Course } from '../types';
import { GRADE_POINTS } from '../utils/gradePoints';
import EditCourseModal from './EditCourseModal';

interface CourseItemProps {
  course: Course;
  onDelete: (id: string) => void;
  onUpdate: (course: Course) => void;
}

const CourseItem = ({ course, onDelete, onUpdate }: CourseItemProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const gradePoint = GRADE_POINTS[course.grade];

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors gap-4">
        <div className="flex-1">
          <h5 className="font-medium text-gray-900 dark:text-white">{course.name}</h5>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
            <span>{course.creditHours} credit{course.creditHours !== 1 ? 's' : ''}</span>
            <span className="hidden sm:inline">•</span>
            <span>Grade: {course.grade}</span>
            <span className="hidden sm:inline">•</span>
            <span>Points: {gradePoint.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setIsEditOpen(true)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Edit course"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete ${course.name}?`)) {
                onDelete(course.id);
              }
            }}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete course"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isEditOpen && (
        <EditCourseModal
          course={course}
          onClose={() => setIsEditOpen(false)}
          onSave={onUpdate}
        />
      )}
    </>
  );
};

export default CourseItem;
