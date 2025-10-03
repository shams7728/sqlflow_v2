#!/usr/bin/env python3
"""
SQLFlow V2 Code Migration Script
Migrates existing code from the current structure to the new monorepo structure
"""

import os
import shutil
import json
import re
from pathlib import Path
from typing import Dict, List, Any

class SQLFlowMigrator:
    def __init__(self, source_dir: str, target_dir: str):
        self.source_dir = Path(source_dir)
        self.target_dir = Path(target_dir)
        self.migration_log = []
        
    def log(self, message: str):
        """Log migration steps"""
        print(f"📝 {message}")
        self.migration_log.append(message)
    
    def migrate_frontend_components(self):
        """Migrate React components to new structure"""
        self.log("Migrating frontend components...")
        
        source_components = self.source_dir / "frontend" / "src" / "components"
        target_components = self.target_dir / "apps" / "web" / "src" / "components"
        
        if source_components.exists():
            target_components.mkdir(parents=True, exist_ok=True)
            
            for component_file in source_components.glob("*.jsx"):
                self.log(f"Converting {component_file.name} to TypeScript...")
                
                # Read original file
                with open(component_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Convert to TypeScript
                ts_content = self.convert_jsx_to_tsx(content)
                
                # Write to new location
                new_file = target_components / component_file.name.replace('.jsx', '.tsx')
                with open(new_file, 'w', encoding='utf-8') as f:
                    f.write(ts_content)
                
                self.log(f"✅ Migrated {component_file.name} -> {new_file.name}")
    
    def convert_jsx_to_tsx(self, content: str) -> str:
        """Convert JSX content to TypeScript"""
        # Add React import if missing
        if "import React" not in content:
            content = "import React from 'react';\n" + content
        
        # Convert function components to TypeScript
        content = re.sub(
            r'export default function (\w+)\(\s*\{([^}]*)\}\s*\)',
            r'interface \1Props {\n  \2\n}\n\nexport default function \1({ \2 }: \1Props)',
            content
        )
        
        # Convert Material-UI imports to Tailwind/HeadlessUI
        mui_replacements = {
            "@mui/material/Box": "@headlessui/react",
            "@mui/material/Button": "../ui/Button",
            "@mui/material/Card": "../ui/Card",
            "@mui/material/TextField": "../ui/Input",
            "@mui/icons-material": "@heroicons/react/24/outline",
        }
        
        for old_import, new_import in mui_replacements.items():
            content = content.replace(old_import, new_import)
        
        # Convert MUI components to new components
        component_replacements = {
            "<Box": "<div",
            "</Box>": "</div>",
            "<Button": "<Button",
            "<TextField": "<Input",
        }
        
        for old_comp, new_comp in component_replacements.items():
            content = content.replace(old_comp, new_comp)
        
        return content
    
    def migrate_backend_routes(self):
        """Migrate Express routes to GraphQL resolvers"""
        self.log("Migrating backend routes to GraphQL resolvers...")
        
        source_routes = self.source_dir / "backend" / "routes"
        target_resolvers = self.target_dir / "apps" / "api" / "src" / "resolvers"
        
        if source_routes.exists():
            target_resolvers.mkdir(parents=True, exist_ok=True)
            
            # Create resolver structure
            resolvers = {
                "Query": {},
                "Mutation": {},
                "User": {},
                "Progress": {}
            }
            
            # Migrate auth routes
            auth_file = source_routes / "auth.js"
            if auth_file.exists():
                self.create_auth_resolver(auth_file, target_resolvers)
            
            # Migrate progress routes
            progress_file = source_routes / "progress.js"
            if progress_file.exists():
                self.create_progress_resolver(progress_file, target_resolvers)
    
    def create_auth_resolver(self, source_file: Path, target_dir: Path):
        """Create GraphQL auth resolver from Express routes"""
        resolver_content = '''import { AuthenticationError, UserInputError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/database';

export const authResolvers = {
  Mutation: {
    async login(_, { email, password }) {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (!user || !user.password) {
        throw new AuthenticationError('Invalid credentials');
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isGuest: user.isGuest
        }
      };
    },

    async register(_, { email, password, name }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (existingUser) {
        throw new UserInputError('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name,
          role: 'STUDENT'
        }
      });

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isGuest: user.isGuest
        }
      };
    },

    async loginAsGuest() {
      const user = await prisma.user.create({
        data: {
          email: `guest_${Date.now()}@sqlflow.com`,
          name: 'Guest User',
          role: 'STUDENT',
          isGuest: true
        }
      });

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isGuest: user.isGuest
        }
      };
    }
  }
};
'''
        
        with open(target_dir / "auth.ts", 'w') as f:
            f.write(resolver_content)
        
        self.log("✅ Created auth resolver")
    
    def create_progress_resolver(self, source_file: Path, target_dir: Path):
        """Create GraphQL progress resolver from Express routes"""
        resolver_content = '''import { AuthenticationError } from 'apollo-server-express';
import { prisma } from '@/database';

export const progressResolvers = {
  Query: {
    async myProgress(_, __, { user }) {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }

      return await prisma.progress.findMany({
        where: { userId: user.id },
        include: { user: true }
      });
    }
  },

  Mutation: {
    async updateProgress(_, { lessonId, status, score, timeSpent }, { user }) {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }

      const progress = await prisma.progress.upsert({
        where: {
          userId_lessonId: {
            userId: user.id,
            lessonId
          }
        },
        update: {
          status,
          score,
          timeSpent,
          completedAt: status === 'COMPLETED' ? new Date() : null
        },
        create: {
          userId: user.id,
          lessonId,
          status,
          score,
          timeSpent,
          completedAt: status === 'COMPLETED' ? new Date() : null
        },
        include: { user: true }
      });

      return progress;
    }
  }
};
'''
        
        with open(target_dir / "progress.ts", 'w') as f:
            f.write(resolver_content)
        
        self.log("✅ Created progress resolver")
    
    def migrate_lesson_content(self):
        """Migrate lesson content files"""
        self.log("Migrating lesson content...")
        
        source_content = self.source_dir / "lesson-content"
        target_content = self.target_dir / "apps" / "web" / "public" / "lessons"
        
        if source_content.exists():
            target_content.mkdir(parents=True, exist_ok=True)
            
            for lesson_file in source_content.glob("*.json"):
                # Copy lesson file
                shutil.copy2(lesson_file, target_content)
                self.log(f"✅ Migrated lesson: {lesson_file.name}")
        
        # Migrate lesson databases
        source_data = self.source_dir / "lesson-data"
        target_data = self.target_dir / "apps" / "web" / "public" / "lesson-data"
        
        if source_data.exists():
            target_data.mkdir(parents=True, exist_ok=True)
            
            for db_file in source_data.glob("*.db"):
                shutil.copy2(db_file, target_data)
                self.log(f"✅ Migrated database: {db_file.name}")
    
    def migrate_python_utilities(self):
        """Migrate Python utility scripts"""
        self.log("Migrating Python utilities...")
        
        target_tools = self.target_dir / "tools" / "lesson-management"
        target_tools.mkdir(parents=True, exist_ok=True)
        
        python_files = [
            "fix_practice_ids.py",
            "validate-lessons.py",
            "sql-select.py"
        ]
        
        for py_file in python_files:
            source_file = self.source_dir / py_file
            if source_file.exists():
                # Update paths in Python files
                with open(source_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Update paths to new structure
                content = content.replace(
                    'Path(__file__).resolve().parent / "lesson-content"',
                    'Path(__file__).resolve().parent.parent.parent / "apps" / "web" / "public" / "lessons"'
                )
                
                target_file = target_tools / py_file
                with open(target_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                self.log(f"✅ Migrated utility: {py_file}")
    
    def create_environment_files(self):
        """Create environment configuration files"""
        self.log("Creating environment files...")
        
        # Web app .env.local
        web_env = self.target_dir / "apps" / "web" / ".env.local"
        with open(web_env, 'w') as f:
            f.write('''# Web App Environment Variables
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_APP_URL=http://localhost:3000
''')
        
        # API .env
        api_env = self.target_dir / "apps" / "api" / ".env"
        with open(api_env, 'w') as f:
            f.write('''# API Environment Variables
DATABASE_URL="postgresql://username:password@localhost:5432/sqlflow_v2"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
PORT=4000

# OpenAI (for future AI features)
OPENAI_API_KEY="your-openai-api-key"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
''')
        
        self.log("✅ Created environment files")
    
    def create_docker_configuration(self):
        """Create Docker configuration"""
        self.log("Creating Docker configuration...")
        
        # Root docker-compose.yml
        docker_compose = self.target_dir / "docker-compose.yml"
        with open(docker_compose, 'w') as f:
            f.write('''version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: sqlflow_v2
      POSTGRES_USER: sqlflow
      POSTGRES_PASSWORD: sqlflow_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
    depends_on:
      - api

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://sqlflow:sqlflow_password@postgres:5432/sqlflow_v2
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-super-secret-jwt-key
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
  redis_data:
''')
        
        # Web Dockerfile
        web_dockerfile = self.target_dir / "apps" / "web" / "Dockerfile"
        web_dockerfile.parent.mkdir(parents=True, exist_ok=True)
        with open(web_dockerfile, 'w') as f:
            f.write('''FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
''')
        
        self.log("✅ Created Docker configuration")
    
    def run_migration(self):
        """Run the complete migration process"""
        self.log("🚀 Starting SQLFlow V2 migration...")
        
        try:
            self.migrate_frontend_components()
            self.migrate_backend_routes()
            self.migrate_lesson_content()
            self.migrate_python_utilities()
            self.create_environment_files()
            self.create_docker_configuration()
            
            self.log("✅ Migration completed successfully!")
            
            # Write migration log
            log_file = self.target_dir / "MIGRATION_LOG.md"
            with open(log_file, 'w') as f:
                f.write("# SQLFlow V2 Migration Log\n\n")
                for entry in self.migration_log:
                    f.write(f"- {entry}\n")
            
            print("\n🎉 Migration Summary:")
            print(f"📁 Source: {self.source_dir}")
            print(f"📁 Target: {self.target_dir}")
            print(f"📝 Log entries: {len(self.migration_log)}")
            print(f"📄 Full log: {log_file}")
            
        except Exception as e:
            self.log(f"❌ Migration failed: {str(e)}")
            raise

def main():
    import sys
    
    if len(sys.argv) != 3:
        print("Usage: python migrate-existing-code.py <source_dir> <target_dir>")
        print("Example: python migrate-existing-code.py ./sqlflow-main ./sqlflow-v2")
        sys.exit(1)
    
    source_dir = sys.argv[1]
    target_dir = sys.argv[2]
    
    if not os.path.exists(source_dir):
        print(f"❌ Source directory does not exist: {source_dir}")
        sys.exit(1)
    
    migrator = SQLFlowMigrator(source_dir, target_dir)
    migrator.run_migration()

if __name__ == "__main__":
    main()