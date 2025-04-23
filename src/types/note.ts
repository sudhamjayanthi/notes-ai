
export interface Note {
  id: string;
  title: string;
  content: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseNote {
  id: string;
  title: string;
  content: string | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}
