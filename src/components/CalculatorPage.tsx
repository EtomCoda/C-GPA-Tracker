
import { useData } from '../contexts/DataContext';
import { useSettings } from '../contexts/SettingsContext';
import { calculateCGPA, getTotalCredits } from '../utils/gpaCalculations';
import { getGradePoints } from '../utils/gradePoints';
import WhatIfCalculator from './WhatIfCalculator';

const CalculatorPage = () => {
  const { semesters } = useData();
  const { gradingScale } = useSettings();
  
  const gradePoints = getGradePoints(gradingScale);
  const cgpa = calculateCGPA(semesters, gradePoints);
  const totalCredits = getTotalCredits(semesters);

  return (
    <WhatIfCalculator
      initialCGPA={cgpa}
      initialCredits={totalCredits}
    />
  );
};

export default CalculatorPage;
