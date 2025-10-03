# Phase 1: Foundation & Core Infrastructure Implementation

## 🎯 Phase 1 Overview
**Duration**: 4 weeks
**Goal**: Establish modern tech stack foundation and development infrastructure

## Week 1: Next.js 14 Migration

### 1.1 Project Structure Setup

#### New Directory Structure
```
sqlflow-v2/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── api/                 # Express + GraphQL backend
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── database/            # Prisma schema & migrations
│   ├── types/               # Shared TypeScript types
│   └── config/              # Shared configurations
├── tools/
│   ├── eslint-config/       # ESLint configurations
│   └── tsconfig/            # TypeScript configurations
└── docs/                    # Documentation
```

### 1.2 Package Configuration

#### Root package.json
```json
{
  "name": "sqlflow-v2",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*",
    "tools/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.2.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0"
  }
}
```

## Week 2: Backend Architecture Upgrade

### 2.1 Database Schema (Prisma)

#### packages/database/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String?
  name      String?
  avatar    String?
  role      Role     @default(STUDENT)
  isGuest   Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  progress        Progress[]
  achievements    Achievement[]
  querySessions   QuerySession[]
  learningPath    LearningPath?

  @@map("users")
}

model Progress {
  id           String   @id @default(cuid())
  userId       String
  lessonId     String
  status       ProgressStatus
  score        Int?
  timeSpent    Int
  completedAt  DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, lessonId])
  @@map("progress")
}

enum Role {
  STUDENT
  INSTRUCTOR
  ADMIN
}

enum ProgressStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
  MASTERED
}
```

### 2.2 GraphQL Setup

#### GraphQL Schema
```graphql
type User {
  id: ID!
  email: String!
  name: String
  avatar: String
  role: Role!
  isGuest: Boolean!
  progress: [Progress!]!
  achievements: [Achievement!]!
  createdAt: DateTime!
}

type Query {
  me: User
  lessons: [Lesson!]!
  lesson(id: String!): Lesson
  myProgress: [Progress!]!
}

type Mutation {
  login(email: String!, password: String!): AuthPayload!
  register(email: String!, password: String!): AuthPayload!
  updateProgress(lessonId: String!, status: ProgressStatus!): Progress!
}

enum Role {
  STUDENT
  INSTRUCTOR
  ADMIN
}

scalar DateTime
```

## Week 3: State Management & Design System

### 3.1 Zustand Store

#### Auth Store
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  isGuest: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);
```

### 3.2 Tailwind Configuration

```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../apps/web/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

## Week 4: Testing & CI/CD

### 4.1 Testing Setup

#### Jest Configuration
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './apps/web',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'apps/web/src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### 4.2 GitHub Actions

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: sqlflow_test
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Run tests
        run: npm run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/sqlflow_test
      
      - name: Build
        run: npm run build
```

## 📋 Implementation Checklist

### Week 1: Next.js Migration
- [ ] Set up monorepo with Turbo
- [ ] Migrate to Next.js 14
- [ ] Configure TypeScript
- [ ] Set up routing structure

### Week 2: Backend Upgrade  
- [ ] Design Prisma schema
- [ ] Set up GraphQL with Apollo
- [ ] Implement auth resolvers
- [ ] Configure Redis caching

### Week 3: State & Design
- [ ] Implement Zustand stores
- [ ] Set up TanStack Query
- [ ] Create Tailwind design system
- [ ] Build core components

### Week 4: Testing & CI/CD
- [ ] Configure Jest testing
- [ ] Set up Playwright E2E
- [ ] Create GitHub Actions
- [ ] Deploy staging environment

## 🎯 Success Criteria

By end of Phase 1:
1. Modern tech stack fully operational
2. Scalable monorepo architecture
3. Comprehensive testing setup
4. Automated CI/CD pipeline
5. Design system foundation

## 🔄 Next Phase

Phase 2 will focus on:
- Enhanced SQL editor with Monaco
- Real-time collaboration features
- Interactive learning components
- Performance optimizations