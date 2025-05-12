export interface DailyNote {
  date: string;
  description: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  streak: number;
  lastCompleted: string | null;
  createdAt: string;
  completedDates: string[];
  dailyNotes: DailyNote[];
}

export interface HabitFormData {
  name: string;
  description?: string;
} 