export interface Church {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingSchedule {
  id: string;
  name: string;
  description?: string;
  planType: 'liturgical' | 'custom';
  createdAt: string;
  updatedAt: string;
  church?: Church;
  entries: DailyReadingEntry[];
}

export interface DailyReadingEntry {
  id: string;
  sortOrder: number;
  date: string;
  type: string;
  references: string[];
  content?: string;
  createdAt: string;
  updatedAt: string;
  readingPlan: ReadingSchedule;
}

export interface DailyReading {
  id: string;
  sortOrder: number;
  date: string;
  type: string;
  references: string[];
  content?: string;
  readingPlan: ReadingSchedule;
}

export type PlanType = 'liturgical' | 'custom';

// Query input types
export interface DailyReadingsForChurchInput {
  churchId: string;
  date: string;
}

export interface ReadingSchedulesForChurchInput {
  churchId: string;
}

export interface ChurchInput {
  id: string;
} 