/*
  # GPA Tracker Database Schema

  ## Overview
  Creates tables for a GPA tracker application with semester tracking, course management, and user goals.

  ## Tables
  
  1. **semesters** - Stores semester information
     - id: UUID primary key
     - user_id: FK to auth.users
     - name: Semester name (e.g., "Fall 2024")
     - created_at: Timestamp
     
  2. **courses** - Stores course information
     - id: UUID primary key
     - semester_id: FK to semesters
     - name: Course name
     - credit_hours: Numeric credit hours (0-6)
     - grade: Letter grade (A, A-, B+, etc.)
     - created_at: Timestamp
     
  3. **goals** - Stores user CGPA goals
     - id: UUID primary key
     - user_id: FK to auth.users
     - target_cgpa: Target CGPA value
     - created_at: Timestamp
     - updated_at: Timestamp

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Authenticated users required for all operations
*/

CREATE TABLE IF NOT EXISTS semesters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  semester_id uuid NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
  name text NOT NULL,
  credit_hours numeric NOT NULL DEFAULT 3,
  grade text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_cgpa numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own semesters"
  ON semesters FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create semesters"
  ON semesters FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own semesters"
  ON semesters FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own semesters"
  ON semesters FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view courses in their semesters"
  ON courses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM semesters
      WHERE semesters.id = courses.semester_id
      AND semesters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create courses in their semesters"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM semesters
      WHERE semesters.id = courses.semester_id
      AND semesters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update courses in their semesters"
  ON courses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM semesters
      WHERE semesters.id = courses.semester_id
      AND semesters.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM semesters
      WHERE semesters.id = courses.semester_id
      AND semesters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete courses in their semesters"
  ON courses FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM semesters
      WHERE semesters.id = courses.semester_id
      AND semesters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_semesters_user_id ON semesters(user_id);
CREATE INDEX idx_courses_semester_id ON courses(semester_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
