export interface InterviewQuestion {
  id: number;
  question: string;
  answer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
  sqlExample?: string;
  explanation?: string;
  followUpQuestions?: string[];
}

export const comprehensiveInterviewQuestions: InterviewQuestion[] = [
  // Basic SQL Questions
  {
    id: 1,
    question: "What is SQL and what does it stand for?",
    answer: "SQL stands for Structured Query Language. It is a standardized programming language designed for managing and manipulating relational databases. SQL is used to perform tasks such as querying data, updating records, creating and modifying database structures, and controlling access to data.",
    difficulty: "Easy",
    category: "Fundamentals",
    tags: ["basics", "definition", "sql"],
    explanation: "This is often the first question in SQL interviews to assess basic understanding."
  },
  
  {
    id: 2,
    question: "What is the difference between INNER JOIN and LEFT JOIN?",
    answer: "INNER JOIN returns only the rows where there is a match in both tables, while LEFT JOIN returns all rows from the left table and matching rows from the right table. If no match is found, NULL values are returned for the right table columns.",
    difficulty: "Easy",
    category: "Joins",
    tags: ["joins", "inner-join", "left-join"],
    sqlExample: "-- INNER JOIN\nSELECT c.name, o.order_date\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id;\n\n-- LEFT JOIN\nSELECT c.name, o.order_date\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id;",
    explanation: "Use INNER JOIN when you only want records that exist in both tables. Use LEFT JOIN when you want all records from the first table, regardless of whether they have matches in the second table.",
    followUpQuestions: ["What about RIGHT JOIN and FULL OUTER JOIN?", "When would you use each type of JOIN?"]
  },

  {
    id: 3,
    question: "Explain the difference between WHERE and HAVING clauses.",
    answer: "WHERE clause filters rows before grouping, while HAVING clause filters groups after the GROUP BY operation. WHERE cannot be used with aggregate functions directly, but HAVING can.",
    difficulty: "Medium",
    category: "Clauses",
    tags: ["where", "having", "group-by", "aggregation"],
    sqlExample: "-- WHERE filters rows before grouping\nSELECT department, COUNT(*)\nFROM employees\nWHERE salary > 50000\nGROUP BY department;\n\n-- HAVING filters groups after grouping\nSELECT department, COUNT(*)\nFROM employees\nGROUP BY department\nHAVING COUNT(*) > 5;",
    explanation: "Think of WHERE as filtering individual records, and HAVING as filtering the results of GROUP BY operations."
  },

  {
    id: 4,
    question: "What is a Primary Key and what are its characteristics?",
    answer: "A Primary Key is a constraint that uniquely identifies each record in a table. Characteristics: 1) Must be unique for each row, 2) Cannot contain NULL values, 3) A table can have only one primary key, 4) Primary key values should not change, 5) Automatically creates a unique index.",
    difficulty: "Easy",
    category: "Constraints",
    tags: ["primary-key", "constraints", "database-design"],
    sqlExample: "CREATE TABLE users (\n  user_id INT PRIMARY KEY,\n  username VARCHAR(50) NOT NULL,\n  email VARCHAR(100) UNIQUE\n);",
    explanation: "Primary keys are fundamental to relational database design and ensure data integrity."
  },

  {
    id: 5,
    question: "How do you find the second highest salary from an employees table?",
    answer: "There are multiple approaches: 1) Using LIMIT with OFFSET, 2) Using subqueries with MAX, 3) Using window functions like ROW_NUMBER() or DENSE_RANK().",
    difficulty: "Medium",
    category: "Advanced Queries",
    tags: ["ranking", "subqueries", "window-functions"],
    sqlExample: "-- Method 1: Using LIMIT\nSELECT DISTINCT salary\nFROM employees\nORDER BY salary DESC\nLIMIT 1 OFFSET 1;\n\n-- Method 2: Using Subquery\nSELECT MAX(salary)\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);\n\n-- Method 3: Using Window Function\nSELECT salary\nFROM (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank\n  FROM employees\n) ranked\nWHERE rank = 2;",
    explanation: "This is a classic SQL interview question that tests knowledge of ranking and subqueries."
  },

  {
    id: 6,
    question: "What is the difference between DELETE, TRUNCATE, and DROP?",
    answer: "DELETE removes specific rows based on conditions and can be rolled back. TRUNCATE removes all rows from a table quickly but cannot be rolled back in most databases. DROP removes the entire table structure and data permanently.",
    difficulty: "Medium",
    category: "DML/DDL",
    tags: ["delete", "truncate", "drop", "data-manipulation"],
    sqlExample: "-- DELETE (can be rolled back, uses WHERE)\nDELETE FROM employees WHERE department = 'Sales';\n\n-- TRUNCATE (faster, removes all rows)\nTRUNCATE TABLE temp_data;\n\n-- DROP (removes table completely)\nDROP TABLE old_archive;",
    explanation: "Understanding these differences is crucial for data management and avoiding accidental data loss."
  },

  {
    id: 7,
    question: "Explain what a subquery is and provide an example.",
    answer: "A subquery is a query nested inside another query. It can be used in SELECT, FROM, WHERE, or HAVING clauses. Subqueries can be correlated (reference outer query) or non-correlated (independent).",
    difficulty: "Medium",
    category: "Subqueries",
    tags: ["subqueries", "nested-queries", "correlated"],
    sqlExample: "-- Non-correlated subquery\nSELECT name, salary\nFROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);\n\n-- Correlated subquery\nSELECT e1.name, e1.salary\nFROM employees e1\nWHERE e1.salary > (\n  SELECT AVG(e2.salary)\n  FROM employees e2\n  WHERE e2.department = e1.department\n);",
    explanation: "Subqueries are powerful for complex filtering and calculations, but can impact performance if not optimized."
  },

  {
    id: 8,
    question: "What are Window Functions and how do they differ from GROUP BY?",
    answer: "Window functions perform calculations across a set of rows related to the current row, but unlike GROUP BY, they don't collapse rows into groups. They allow you to keep individual row details while performing aggregate calculations.",
    difficulty: "Hard",
    category: "Window Functions",
    tags: ["window-functions", "analytics", "ranking"],
    sqlExample: "-- Window function (keeps all rows)\nSELECT \n  employee_name,\n  salary,\n  department,\n  AVG(salary) OVER (PARTITION BY department) as dept_avg_salary,\n  ROW_NUMBER() OVER (ORDER BY salary DESC) as salary_rank\nFROM employees;\n\n-- GROUP BY (collapses rows)\nSELECT \n  department,\n  AVG(salary) as dept_avg_salary\nFROM employees\nGROUP BY department;",
    explanation: "Window functions are essential for analytics and reporting, allowing complex calculations while preserving row-level detail."
  },

  {
    id: 9,
    question: "How would you optimize a slow-running SQL query?",
    answer: "Query optimization strategies include: 1) Analyze execution plan, 2) Add appropriate indexes, 3) Rewrite subqueries as JOINs, 4) Use LIMIT for large result sets, 5) Avoid SELECT *, 6) Use WHERE instead of HAVING when possible, 7) Consider query structure and join order.",
    difficulty: "Hard",
    category: "Performance",
    tags: ["optimization", "performance", "indexing", "execution-plan"],
    sqlExample: "-- Before optimization\nSELECT *\nFROM orders o\nWHERE o.customer_id IN (\n  SELECT c.id FROM customers c WHERE c.city = 'New York'\n);\n\n-- After optimization\nSELECT o.order_id, o.order_date, o.total\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.id\nWHERE c.city = 'New York'\nAND o.order_date >= '2024-01-01';",
    explanation: "Query optimization is crucial for database performance, especially with large datasets."
  },

  {
    id: 10,
    question: "What is database normalization and why is it important?",
    answer: "Database normalization is the process of organizing data to reduce redundancy and improve data integrity. It involves dividing large tables into smaller, related tables and defining relationships between them. The main normal forms are 1NF, 2NF, 3NF, and BCNF.",
    difficulty: "Medium",
    category: "Database Design",
    tags: ["normalization", "database-design", "data-integrity"],
    explanation: "Normalization is fundamental to good database design and helps prevent data anomalies and inconsistencies."
  }
];

export const interviewCategories = [
  { name: 'Fundamentals', count: 15, color: 'blue' },
  { name: 'Joins', count: 12, color: 'green' },
  { name: 'Clauses', count: 8, color: 'purple' },
  { name: 'Functions', count: 10, color: 'pink' },
  { name: 'Performance', count: 7, color: 'orange' },
  { name: 'Advanced Queries', count: 9, color: 'indigo' },
  { name: 'Database Design', count: 6, color: 'cyan' }
];

export const difficultyStats = {
  Easy: { count: 20, percentage: 40 },
  Medium: { count: 18, percentage: 36 },
  Hard: { count: 12, percentage: 24 }
};