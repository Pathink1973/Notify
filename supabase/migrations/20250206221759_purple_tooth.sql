/*
  # Notes Application Schema

  1. New Tables
    - `notes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `content` (text)
      - `color` (text)
      - `is_pinned` (boolean)
      - `is_archived` (boolean)
      - `is_deleted` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `due_date` (timestamptz, nullable)

    - `note_labels`
      - `id` (uuid, primary key)
      - `note_id` (uuid, references notes)
      - `label` (text)

    - `note_attachments`
      - `id` (uuid, primary key)
      - `note_id` (uuid, references notes)
      - `type` (text)
      - `name` (text)
      - `url` (text)
      - `size` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own notes
      - Create new notes
      - Update their own notes
      - Delete their own notes
*/

-- Create notes table
CREATE TABLE notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT 'default',
  is_pinned boolean NOT NULL DEFAULT false,
  is_archived boolean NOT NULL DEFAULT false,
  is_deleted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  due_date timestamptz
);

-- Create note_labels table
CREATE TABLE note_labels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
  label text NOT NULL,
  UNIQUE(note_id, label)
);

-- Create note_attachments table
CREATE TABLE note_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  name text NOT NULL,
  url text NOT NULL,
  size integer NOT NULL
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_attachments ENABLE ROW LEVEL SECURITY;

-- Notes policies
CREATE POLICY "Users can read own notes"
  ON notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create notes"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Note labels policies
CREATE POLICY "Users can read own note labels"
  ON note_labels
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM notes
    WHERE notes.id = note_labels.note_id
    AND notes.user_id = auth.uid()
  ));

CREATE POLICY "Users can create note labels"
  ON note_labels
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM notes
    WHERE notes.id = note_labels.note_id
    AND notes.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete note labels"
  ON note_labels
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM notes
    WHERE notes.id = note_labels.note_id
    AND notes.user_id = auth.uid()
  ));

-- Note attachments policies
CREATE POLICY "Users can read own note attachments"
  ON note_attachments
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM notes
    WHERE notes.id = note_attachments.note_id
    AND notes.user_id = auth.uid()
  ));

CREATE POLICY "Users can create note attachments"
  ON note_attachments
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM notes
    WHERE notes.id = note_attachments.note_id
    AND notes.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete note attachments"
  ON note_attachments
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM notes
    WHERE notes.id = note_attachments.note_id
    AND notes.user_id = auth.uid()
  ));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to notes table
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();