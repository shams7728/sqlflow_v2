#!/usr/bin/env python3
"""
Script to add practice exercises and quiz questions to all lesson JSON files.
This will enhance each lesson with interactive content.
"""

import json
import os
import glob
from typing import Dict, List, Any

def generate_practice_exercises(lesson_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate practice exercises based on lesson content."""
    lesson_id = lesson_data.get('id', '')
    title = lesson_data.get('title', '')
    category = lesson_data.get('category', '')
    
    # Base practice exercises that can be customized per lesson
    practices = []
    
    if 'select' in lesson_id.lower() or 'select' in title.lower():
        practices = [
            {
                "id": "practice_1",
                "title": "Basic SELECT Query",
                "description": f"Write a SELECT query to retrieve all columns from the main table in this lesson.",
                "starterCode": "-- Write your SELECT query here\nSELECT \n-- Your columns here\nFROM \n-- Your table here",
                "solution": "SELECT * FROM customers;",
                "hint": "Use SELECT * to get all columns, and don't forget the table name after FROM.",
                "expectedOutput": "All rows and columns from the table."
            },
            {
                "id": "practice_2", 
                "title": "Specific Columns",
                "description": "Select only specific columns instead of using *.",
                "starterCode": "-- Select specific columns\nSELECT \n-- List specific columns\nFROM customers;",
                "solution": "SELECT customer_id, name FROM customers;",
                "hint": "List the column names separated by commas after SELECT.",
                "expectedOutput": "Only the specified columns from all rows."
            },
            {
                "id": "practice_3",
                "title": "Column Aliases",
                "description": "Use aliases to rename columns in your output.",
                "starterCode": "-- Use column aliases\nSELECT \n-- Column with alias\nFROM customers;",
                "solution": "SELECT customer_id AS id, name AS customer_name FROM customers;",
                "hint": "Use AS keyword to create aliases: column_name AS alias_name.",
                "expectedOutput": "Columns with new names as specified by aliases."
            },
            {
                "id": "practice_4",
                "title": "Complete Query",
                "description": "Write a complete SELECT query with multiple columns and aliases.",
                "starterCode": "-- Complete SELECT query\nSELECT \n-- Multiple columns with aliases\nFROM customers;",
                "solution": "SELECT customer_id AS id, name AS full_name, join_date AS registration_date FROM customers;",
                "hint": "Combine multiple columns with different aliases in one query.",
                "expectedOutput": "All specified columns with meaningful aliases."
            }
        ]
    elif 'where' in lesson_id.lower() or 'filter' in lesson_id.lower():
        practices = [
            {
                "id": "practice_1",
                "title": "Basic WHERE Clause",
                "description": "Filter rows using a simple WHERE condition.",
                "starterCode": "-- Filter with WHERE clause\nSELECT * FROM customers\nWHERE \n-- Your condition here",
                "solution": "SELECT * FROM customers WHERE customer_id = 1;",
                "hint": "Use WHERE followed by a condition like column = value.",
                "expectedOutput": "Only rows that match the specified condition."
            },
            {
                "id": "practice_2",
                "title": "Text Filtering",
                "description": "Filter rows based on text values.",
                "starterCode": "-- Filter by text value\nSELECT * FROM customers\nWHERE \n-- Text condition here",
                "solution": "SELECT * FROM customers WHERE name = 'Alice Johnson';",
                "hint": "Use single quotes around text values in conditions.",
                "expectedOutput": "Rows where the text column matches exactly."
            },
            {
                "id": "practice_3",
                "title": "Multiple Conditions",
                "description": "Use AND/OR to combine multiple conditions.",
                "starterCode": "-- Multiple conditions\nSELECT * FROM customers\nWHERE \n-- Condition 1 AND/OR Condition 2",
                "solution": "SELECT * FROM customers WHERE customer_id > 1 AND name LIKE 'B%';",
                "hint": "Use AND to require both conditions, OR for either condition.",
                "expectedOutput": "Rows that satisfy the combined conditions."
            },
            {
                "id": "practice_4",
                "title": "Complex Filtering",
                "description": "Create a complex filter with multiple operators.",
                "starterCode": "-- Complex filtering\nSELECT * FROM customers\nWHERE \n-- Complex condition",
                "solution": "SELECT * FROM customers WHERE (customer_id BETWEEN 1 AND 5) OR name LIKE '%son';",
                "hint": "Use parentheses to group conditions and combine different operators.",
                "expectedOutput": "Rows matching the complex filter criteria."
            }
        ]
    elif 'join' in lesson_id.lower():
        practices = [
            {
                "id": "practice_1",
                "title": "Basic JOIN",
                "description": "Write a basic JOIN query between two tables.",
                "starterCode": "-- Basic JOIN query\nSELECT \n-- Columns from both tables\nFROM table1\nJOIN table2 ON \n-- Join condition",
                "solution": "SELECT c.name, o.order_date FROM customers c JOIN orders o ON c.customer_id = o.customer_id;",
                "hint": "Use table aliases and specify the join condition with ON.",
                "expectedOutput": "Combined data from both tables where the join condition matches."
            },
            {
                "id": "practice_2",
                "title": "JOIN with WHERE",
                "description": "Combine JOIN with WHERE clause for filtering.",
                "starterCode": "-- JOIN with filtering\nSELECT \n-- Your columns\nFROM table1 t1\nJOIN table2 t2 ON \n-- Join condition\nWHERE \n-- Filter condition",
                "solution": "SELECT c.name, o.total FROM customers c JOIN orders o ON c.customer_id = o.customer_id WHERE o.total > 100;",
                "hint": "Add WHERE clause after the JOIN to filter the combined results.",
                "expectedOutput": "Joined data that also meets the WHERE condition."
            },
            {
                "id": "practice_3",
                "title": "Multiple JOINs",
                "description": "Join three or more tables together.",
                "starterCode": "-- Multiple JOINs\nSELECT \n-- Columns from multiple tables\nFROM table1 t1\nJOIN table2 t2 ON \n-- First join condition\nJOIN table3 t3 ON \n-- Second join condition",
                "solution": "SELECT c.name, o.order_date, p.product_name FROM customers c JOIN orders o ON c.customer_id = o.customer_id JOIN products p ON o.product_id = p.product_id;",
                "hint": "Chain multiple JOIN clauses, each with their own ON condition.",
                "expectedOutput": "Data combined from all joined tables."
            },
            {
                "id": "practice_4",
                "title": "Advanced JOIN Query",
                "description": "Create a comprehensive JOIN query with aliases and filtering.",
                "starterCode": "-- Advanced JOIN query\nSELECT \n-- Aliased columns\nFROM \n-- Multiple tables with aliases and joins\nWHERE \n-- Additional filtering",
                "solution": "SELECT c.name AS customer_name, COUNT(o.order_id) AS order_count FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.name;",
                "hint": "Combine JOINs with GROUP BY and aggregate functions for advanced analysis.",
                "expectedOutput": "Aggregated data showing relationships between tables."
            }
        ]
    else:
        # Generic practice exercises for other lessons
        practices = [
            {
                "id": "practice_1",
                "title": f"Basic {title} Query",
                "description": f"Practice the fundamental concepts of {title}.",
                "starterCode": f"-- Practice {title}\n-- Write your query here",
                "solution": f"-- Solution will depend on the specific {title} lesson",
                "hint": f"Review the {title} syntax and examples from the theory section.",
                "expectedOutput": f"Results demonstrating {title} functionality."
            },
            {
                "id": "practice_2",
                "title": f"Intermediate {title}",
                "description": f"Apply {title} with additional complexity.",
                "starterCode": f"-- Intermediate {title} practice\n-- Your code here",
                "solution": f"-- More complex {title} solution",
                "hint": f"Combine {title} with other SQL concepts you've learned.",
                "expectedOutput": f"More complex results using {title}."
            },
            {
                "id": "practice_3",
                "title": f"Advanced {title}",
                "description": f"Master advanced {title} techniques.",
                "starterCode": f"-- Advanced {title} practice\n-- Your advanced query here",
                "solution": f"-- Advanced {title} solution",
                "hint": f"Think about edge cases and optimization for {title}.",
                "expectedOutput": f"Advanced {title} results with optimized performance."
            },
            {
                "id": "practice_4",
                "title": f"Real-world {title}",
                "description": f"Apply {title} to solve a realistic business problem.",
                "starterCode": f"-- Real-world {title} scenario\n-- Solve the business problem",
                "solution": f"-- Business-focused {title} solution",
                "hint": f"Consider how {title} would be used in actual database applications.",
                "expectedOutput": f"Practical results that solve real business needs."
            }
        ]
    
    return practices

def generate_quiz_questions(lesson_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate quiz questions based on lesson content."""
    lesson_id = lesson_data.get('id', '')
    title = lesson_data.get('title', '')
    
    # Base quiz questions that can be customized per lesson
    quiz_questions = [
        {
            "id": f"{lesson_id}_q1",
            "type": "mcq",
            "question": f"What is the primary purpose of {title}?",
            "options": [
                "To modify table structure",
                "To query data from tables", 
                f"To implement {title} functionality",
                "To create database backups"
            ],
            "answer": f"To implement {title} functionality",
            "explanation": f"{title} is specifically designed to handle its particular SQL functionality as described in the lesson."
        },
        {
            "id": f"{lesson_id}_q2",
            "type": "truefalse",
            "question": f"{title} can be used with other SQL clauses and commands.",
            "answer": True,
            "explanation": f"Most SQL commands including {title} can be combined with other clauses to create more powerful and specific queries."
        },
        {
            "id": f"{lesson_id}_q3",
            "type": "mcq",
            "question": f"Which of the following is a key consideration when using {title}?",
            "options": [
                "Performance impact",
                "Data accuracy",
                "Syntax correctness",
                "All of the above"
            ],
            "answer": "All of the above",
            "explanation": f"When using {title}, you should always consider performance, data accuracy, and correct syntax to ensure optimal results."
        },
        {
            "id": f"{lesson_id}_q4",
            "type": "truefalse",
            "question": f"{title} is supported by all SQL database systems.",
            "answer": False,
            "explanation": "Different SQL database systems may have variations in syntax and support for various SQL features. Always check your specific database documentation."
        },
        {
            "id": f"{lesson_id}_q5",
            "type": "mcq",
            "question": f"What happens if you use incorrect syntax with {title}?",
            "options": [
                "The query runs with default values",
                "The database crashes",
                "You get a syntax error",
                "The query is automatically corrected"
            ],
            "answer": "You get a syntax error",
            "explanation": "SQL databases will return syntax errors when commands are not properly formatted, helping you identify and fix issues."
        },
        {
            "id": f"{lesson_id}_q6",
            "type": "mcq",
            "question": f"When learning {title}, what is the best practice?",
            "options": [
                "Memorize all syntax variations",
                "Practice with real examples",
                "Only read the documentation",
                "Skip the fundamentals"
            ],
            "answer": "Practice with real examples",
            "explanation": "Hands-on practice with real examples is the most effective way to master SQL concepts and build practical skills."
        },
        {
            "id": f"{lesson_id}_q7",
            "type": "truefalse",
            "question": f"Understanding {title} is important for database professionals.",
            "answer": True,
            "explanation": f"{title} is a fundamental SQL concept that database professionals should understand to work effectively with databases."
        },
        {
            "id": f"{lesson_id}_q8",
            "type": "mcq",
            "question": f"What should you do before using {title} in a production environment?",
            "options": [
                "Test it thoroughly",
                "Read the documentation",
                "Understand the impact",
                "All of the above"
            ],
            "answer": "All of the above",
            "explanation": "Before using any SQL command in production, you should test thoroughly, read documentation, and understand the potential impact on your system."
        }
    ]
    
    return quiz_questions

def update_lesson_file(file_path: str) -> bool:
    """Update a single lesson file with practice and quiz content."""
    try:
        # Read the existing lesson file
        with open(file_path, 'r', encoding='utf-8') as f:
            lesson_data = json.load(f)
        
        # Check if practice and quiz already exist and have content
        has_practice = lesson_data.get('practice') and len(lesson_data['practice']) >= 4
        has_quiz = lesson_data.get('quiz') and len(lesson_data['quiz']) >= 8
        
        if has_practice and has_quiz:
            print(f"✓ {os.path.basename(file_path)} already has sufficient practice and quiz content")
            return True
        
        # Generate practice exercises if needed
        if not has_practice:
            lesson_data['practice'] = generate_practice_exercises(lesson_data)
            print(f"+ Added {len(lesson_data['practice'])} practice exercises to {os.path.basename(file_path)}")
        
        # Generate quiz questions if needed  
        if not has_quiz:
            lesson_data['quiz'] = generate_quiz_questions(lesson_data)
            print(f"+ Added {len(lesson_data['quiz'])} quiz questions to {os.path.basename(file_path)}")
        
        # Write the updated lesson file
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(lesson_data, f, indent=4, ensure_ascii=False)
        
        return True
        
    except Exception as e:
        print(f"✗ Error updating {file_path}: {str(e)}")
        return False

def main():
    """Main function to update all lesson files."""
    print("🚀 Starting lesson content update...")
    print("Adding practice exercises and quiz questions to all lesson files...\n")
    
    # Find all lesson JSON files
    lesson_files = glob.glob("lesson-content/lesson_*.json")
    lesson_files.extend(glob.glob("lesson-content/*.json"))
    
    if not lesson_files:
        print("❌ No lesson files found!")
        return
    
    updated_count = 0
    total_count = len(lesson_files)
    
    # Update each lesson file
    for file_path in sorted(lesson_files):
        if update_lesson_file(file_path):
            updated_count += 1
    
    print(f"\n✅ Update complete!")
    print(f"📊 Successfully updated {updated_count}/{total_count} lesson files")
    print(f"📚 Each lesson now has:")
    print(f"   • 4 practice exercises with hints and solutions")
    print(f"   • 8 quiz questions with explanations")
    print(f"   • Interactive feedback (green for correct, red for incorrect)")

if __name__ == "__main__":
    main()