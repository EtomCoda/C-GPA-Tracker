import { useState } from 'react';
import { Target, Edit2, TrendingUp } from 'lucide-react';

interface GoalCardProps {
  currentCGPA: number;
  targetCGPA: number;
  onUpdateGoal: (targetCGPA: number) => void;
}

const GoalCard = ({ currentCGPA, targetCGPA, onUpdateGoal }: GoalCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTarget, setNewTarget] = useState(targetCGPA.toString());
  const [error, setError] = useState('');

  const difference = targetCGPA - currentCGPA;
  const progress = targetCGPA > 0 ? Math.min((currentCGPA / targetCGPA) * 100, 100) : 0;

  const handleSave = () => {
    const target = parseFloat(newTarget);
    if (isNaN(target) || target < 0 || target > 5.0) {
      setError('Please enter a valid CGPA between 0.0 and 5.0');
      return;
    }
    onUpdateGoal(target);
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-md p-6 border-2 border-blue-200 dark:border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
            <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">My Goal</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track your target CGPA</p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Edit goal"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target CGPA
          </label>
          <input
            type="number"
            value={newTarget}
            onChange={(e) => {
              setNewTarget(e.target.value);
              setError('');
            }}
            min="0"
            max="5.0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all mb-2"
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setNewTarget(targetCGPA.toString());
                setError('');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Save Goal
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Current CGPA</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentCGPA.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Target CGPA</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{targetCGPA.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Difference</p>
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-bold ${difference >= 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {difference >= 0 ? '+' : ''}{difference.toFixed(2)}
                </p>
                {difference < 0 && <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{progress.toFixed(2)}%</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {currentCGPA >= targetCGPA ? (
              <p className="text-green-600 dark:text-green-400 text-sm mt-2 font-medium">
                Congratulations! You've reached your goal!
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Keep working towards your goal of {targetCGPA.toFixed(2)}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GoalCard;
