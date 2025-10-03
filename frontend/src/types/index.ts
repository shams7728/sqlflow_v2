// Core types for SQLFlow application

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  isGuest: boolean;
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedTime: string;
  starterQuery?: string;
  theory: TheoryBlock[];
  examples: Example[];
  practice: Exercise[];
  quiz: QuizQuestion[];
  schema?: DatabaseSchema;
  sample_data?: Record<string, any[]>;
  content?: {
    theory?: {
      concepts?: Array<{
        id: string;
        title: string;
        content?: string;
        visualDiagrams?: any[];
        [key: string]: any;
      }>;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

export interface TheoryBlock {
  type: 'paragraph' | 'code' | 'note' | 'warning' | 'tip';
  text: string;
}

export interface Example {
  query: string;
  description: string;
  explanation: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  challenge?: string;
  solution: string;
  hint?: string;
  starterCode?: string;
  expectedOutput?: any;
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'truefalse' | 'fill-in-the-blank';
  question: string;
  options?: string[];
  answer: string | boolean;
  explanation?: string;
}

export interface DatabaseSchema {
  tables: Table[];
}

export interface Table {
  name: string;
  columns: Column[];
}

export interface Column {
  name: string;
  type: string;
  constraints?: string;
}

export interface Progress {
  id: string;
  lessonId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'MASTERED';
  score?: number;
  timeSpent: number;
  completedAt?: string;
}

export interface Achievement {
  id: string;
  badgeType: string;
  title: string;
  description: string;
  iconUrl?: string;
  earnedAt: string;
}

export interface QueryResult {
  success: boolean;
  data?: any[];
  columns?: string[];
  error?: string;
  executionTime?: number;
}

export interface AuthPayload {
  token: string;
  user: User;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// GraphQL types
export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    path?: string[];
  }>;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  description?: string;
}

// Store types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export interface LessonState {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  isLoading: boolean;
  error: string | null;
  fetchLessons: () => Promise<void>;
  setCurrentLesson: (lesson: Lesson | null) => void;
}

export interface ProgressState {
  progress: Record<string, Progress>;
  isLoading: boolean;
  updateProgress: (lessonId: string, data: Partial<Progress>) => Promise<void>;
  getProgress: (lessonId: string) => Progress | null;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// SQL Editor types
export interface EditorState {
  query: string;
  isExecuting: boolean;
  result: QueryResult | null;
  history: string[];
  setQuery: (query: string) => void;
  executeQuery: (lessonId: string) => Promise<void>;
  addToHistory: (query: string) => void;
}

// Navigation types
export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon?: React.ComponentType;
  children?: NavigationItem[];
}

export interface BreadcrumbItem {
  title: string;
  path?: string;
}