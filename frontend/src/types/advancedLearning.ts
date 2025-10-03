// Advanced Learning Platform Types

export interface ConceptBlock {
  id: string;
  title: string;
  content: string;
  codeExample?: string;
  visualization?: string;
  keyPoints: string[];
}

export interface CodeExample {
  id: string;
  title: string;
  description: string;
  code: string;
  expectedOutput?: any[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  starterCode?: string;
  solution: string;
  hints: string[];
  testCases: TestCase[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
}

export interface TestCase {
  id: string;
  description: string;
  input?: any;
  expectedOutput: any[];
  isHidden?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  scenario: string;
  requirements: string[];
  constraints: string[];
  sampleData: string;
  solution: string;
  rubric: AssessmentRubric;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  tags: string[];
}

export interface Scenario {
  id: string;
  title: string;
  context: string;
  businessProblem: string;
  dataDescription: string;
  tasks: ScenarioTask[];
  successCriteria: string[];
  realWorldApplication: string;
}

export interface ScenarioTask {
  id: string;
  description: string;
  expectedQuery: string;
  points: number;
  hints: string[];
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'code-completion' | 'drag-drop' | 'sql-writing' | 'error-identification';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  concept: string;
  points: number;
}

export interface CodingAssessment {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  problems: CodingProblem[];
  passingScore: number;
  allowedAttempts: number;
}

export interface CodingProblem {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  testCases: TestCase[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  deliverables: string[];
  timeline: number;
  resources: ProjectResource[];
  assessmentCriteria: AssessmentCriteria[];
}

export interface ProjectResource {
  type: 'dataset' | 'documentation' | 'template' | 'example';
  title: string;
  url: string;
  description: string;
}

export interface AssessmentCriteria {
  criterion: string;
  description: string;
  maxPoints: number;
  rubric: AssessmentRubric;
}

export interface AssessmentRubric {
  excellent: RubricLevel;
  good: RubricLevel;
  satisfactory: RubricLevel;
  needsImprovement: RubricLevel;
}

export interface RubricLevel {
  description: string;
  points: number;
  examples?: string[];
}

export interface ComprehensiveLessonContent {
  metadata: {
    id: string;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    estimatedTime: number;
    prerequisites: string[];
    learningObjectives: string[];
    tags: string[];
    category: string;
    subcategory?: string;
  };
  
  content: {
    theory: {
      introduction: string;
      concepts: ConceptBlock[];
      examples: CodeExample[];
      bestPractices: string[];
      commonMistakes: string[];
      summary: string;
    };
    
    practice: {
      guidedExercises: Exercise[];
      challenges: Challenge[];
      realWorldScenarios: Scenario[];
    };
    
    assessment: {
      quiz: QuizQuestion[];
      practicalTest: CodingAssessment;
      projectTask?: ProjectTask;
    };
  };
  
  resources: {
    documentation: string[];
    externalLinks: string[];
    downloadableFiles: string[];
    videoTutorials?: string[];
    relatedLessons: string[];
  };
  
  interactivity: {
    hasLiveCode: boolean;
    hasVisualizations: boolean;
    hasInteractiveExamples: boolean;
    hasRealTimeExecution: boolean;
    hasAIAssistance: boolean;
  };
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration: number;
  lessons: string[];
  prerequisites: string[];
  outcomes: string[];
  certification?: string;
}

export interface SkillAssessment {
  id: string;
  skillArea: string;
  questions: QuizQuestion[];
  practicalTasks: CodingProblem[];
  timeLimit: number;
  passingScore: number;
  certification?: string;
}

export interface UserSkillProfile {
  userId: string;
  skills: SkillLevel[];
  completedPaths: string[];
  currentPath?: string;
  weakAreas: string[];
  strongAreas: string[];
  recommendedContent: string[];
  lastAssessment: Date;
}

export interface SkillLevel {
  skill: string;
  level: 'novice' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
  confidence: number;
  lastPracticed: Date;
  practiceCount: number;
  assessmentScore?: number;
}

export interface AIAssistantResponse {
  type: 'optimization' | 'explanation' | 'hint' | 'correction' | 'suggestion';
  content: string;
  codeExample?: string;
  confidence: number;
  sources?: string[];
  followUpQuestions?: string[];
}

export interface QueryAnalysis {
  query: string;
  executionTime: number;
  rowsAffected: number;
  optimizationSuggestions: string[];
  performanceScore: number;
  complexity: 'low' | 'medium' | 'high';
  bestPracticesViolations: string[];
  alternativeApproaches: string[];
}

export interface LearningAnalytics {
  userId: string;
  timeSpent: number;
  conceptsMastered: string[];
  strugglingAreas: string[];
  learningVelocity: number;
  engagementScore: number;
  recommendedNextSteps: string[];
  skillProgression: SkillProgression[];
}

export interface SkillProgression {
  skill: string;
  startLevel: number;
  currentLevel: number;
  targetLevel: number;
  progressRate: number;
  estimatedTimeToTarget: number;
}