#!/usr/bin/env python3
"""
Script to add visual diagrams to all JOIN lesson files
"""

import json
import os

# Define visual diagrams for each JOIN type
VISUAL_DIAGRAMS = {
    "inner-join": {
        "type": "venn-diagram",
        "joinType": "INNER JOIN",
        "description": "Returns only matching records from both tables",
        "leftTable": "Employees",
        "rightTable": "Departments",
        "highlightedArea": "intersection",
        "example": {
            "tableA": [
                {"id": 1, "name": "Alice", "dept_id": 1},
                {"id": 2, "name": "Bob", "dept_id": 2},
                {"id": 3, "name": "Charlie", "dept_id": 3},
                {"id": 4, "name": "Diana", "dept_id": None}
            ],
            "tableB": [
                {"id": 1, "name": "Engineering"},
                {"id": 2, "name": "Marketing"},
                {"id": 4, "name": "Sales"}
            ],
            "result": [
                {"id": 1, "name": "Alice", "dept_id": 1, "dept_name": "Engineering"},
                {"id": 2, "name": "Bob", "dept_id": 2, "dept_name": "Marketing"}
            ]
        }
    },
    "left-join": {
        "type": "venn-diagram",
        "joinType": "LEFT JOIN",
        "description": "Returns all records from left table and matching records from right table",
        "leftTable": "Employees",
        "rightTable": "Departments",
        "highlightedArea": "left-and-intersection",
        "example": {
            "tableA": [
                {"id": 1, "name": "Alice", "dept_id": 1},
                {"id": 2, "name": "Bob", "dept_id": 2},
                {"id": 3, "name": "Charlie", "dept_id": 3},
                {"id": 4, "name": "Diana", "dept_id": None}
            ],
            "tableB": [
                {"id": 1, "name": "Engineering"},
                {"id": 2, "name": "Marketing"},
                {"id": 4, "name": "Sales"}
            ],
            "result": [
                {"id": 1, "name": "Alice", "dept_id": 1, "dept_name": "Engineering"},
                {"id": 2, "name": "Bob", "dept_id": 2, "dept_name": "Marketing"},
                {"id": 3, "name": "Charlie", "dept_id": 3, "dept_name": None},
                {"id": 4, "name": "Diana", "dept_id": None, "dept_name": None}
            ]
        }
    },
    "right-join": {
        "type": "venn-diagram",
        "joinType": "RIGHT JOIN",
        "description": "Returns all records from right table and matching records from left table",
        "leftTable": "Employees",
        "rightTable": "Departments",
        "highlightedArea": "right-and-intersection",
        "example": {
            "tableA": [
                {"id": 1, "name": "Alice", "dept_id": 1},
                {"id": 2, "name": "Bob", "dept_id": 2}
            ],
            "tableB": [
                {"id": 1, "name": "Engineering"},
                {"id": 2, "name": "Marketing"},
                {"id": 3, "name": "HR"},
                {"id": 4, "name": "Sales"}
            ],
            "result": [
                {"id": 1, "name": "Alice", "dept_id": 1, "dept_name": "Engineering"},
                {"id": 2, "name": "Bob", "dept_id": 2, "dept_name": "Marketing"},
                {"id": None, "name": None, "dept_id": 3, "dept_name": "HR"},
                {"id": None, "name": None, "dept_id": 4, "dept_name": "Sales"}
            ]
        }
    },
    "full-join": {
        "type": "venn-diagram",
        "joinType": "FULL OUTER JOIN",
        "description": "Returns all records from both tables, with NULLs where there's no match",
        "leftTable": "Employees",
        "rightTable": "Departments",
        "highlightedArea": "all",
        "example": {
            "tableA": [
                {"id": 1, "name": "Alice", "dept_id": 1},
                {"id": 2, "name": "Bob", "dept_id": 2},
                {"id": 3, "name": "Charlie", "dept_id": None}
            ],
            "tableB": [
                {"id": 1, "name": "Engineering"},
                {"id": 2, "name": "Marketing"},
                {"id": 4, "name": "Sales"}
            ],
            "result": [
                {"id": 1, "name": "Alice", "dept_id": 1, "dept_name": "Engineering"},
                {"id": 2, "name": "Bob", "dept_id": 2, "dept_name": "Marketing"},
                {"id": 3, "name": "Charlie", "dept_id": None, "dept_name": None},
                {"id": None, "name": None, "dept_id": 4, "dept_name": "Sales"}
            ]
        }
    },
    "cross-join": {
        "type": "grid-diagram",
        "joinType": "CROSS JOIN",
        "description": "Returns Cartesian product - every row from first table paired with every row from second table",
        "leftTable": "Sizes",
        "rightTable": "Colors",
        "highlightedArea": "all",
        "example": {
            "tableA": [
                {"size": "Small"},
                {"size": "Medium"},
                {"size": "Large"}
            ],
            "tableB": [
                {"color": "Red"},
                {"color": "Blue"}
            ],
            "result": [
                {"size": "Small", "color": "Red"},
                {"size": "Small", "color": "Blue"},
                {"size": "Medium", "color": "Red"},
                {"size": "Medium", "color": "Blue"},
                {"size": "Large", "color": "Red"},
                {"size": "Large", "color": "Blue"}
            ]
        }
    },
    "self-join": {
        "type": "hierarchy-diagram",
        "joinType": "SELF JOIN",
        "description": "Joins a table with itself to find hierarchical relationships",
        "leftTable": "Employees (as Employee)",
        "rightTable": "Employees (as Manager)",
        "highlightedArea": "self-reference",
        "example": {
            "tableA": [
                {"id": 1, "name": "Alice", "manager_id": None},
                {"id": 2, "name": "Bob", "manager_id": 1},
                {"id": 3, "name": "Charlie", "manager_id": 1},
                {"id": 4, "name": "Diana", "manager_id": 2}
            ],
            "tableB": "Same as Table A",
            "result": [
                {"employee": "Bob", "manager": "Alice"},
                {"employee": "Charlie", "manager": "Alice"},
                {"employee": "Diana", "manager": "Bob"}
            ]
        }
    }
}

def add_visual_to_lesson(lesson_id, lesson_file):
    """Add visual diagram to a lesson JSON file"""
    
    # Read the lesson file
    with open(lesson_file, 'r', encoding='utf-8') as f:
        lesson_data = json.load(f)
    
    # Get the visual diagram for this JOIN type
    visual_diagram = VISUAL_DIAGRAMS.get(lesson_id)
    
    if not visual_diagram:
        print(f"No visual diagram defined for {lesson_id}")
        return False
    
    # Add content structure if it doesn't exist
    if 'content' not in lesson_data:
        lesson_data['content'] = {}
    
    if 'theory' not in lesson_data['content']:
        lesson_data['content']['theory'] = {}
    
    if 'concepts' not in lesson_data['content']['theory']:
        lesson_data['content']['theory']['concepts'] = []
    
    # Add the visual diagram as a concept
    visual_concept = {
        "id": f"{lesson_id}-visual",
        "title": f"Visual Guide to {visual_diagram['joinType']}",
        "content": visual_diagram['description'],
        "visualDiagrams": [visual_diagram]
    }
    
    lesson_data['content']['theory']['concepts'].append(visual_concept)
    
    # Write back to file
    with open(lesson_file, 'w', encoding='utf-8') as f:
        json.dump(lesson_data, f, indent=4, ensure_ascii=False)
    
    print(f"✅ Added visual diagram to {lesson_id}")
    return True

def main():
    """Main function to process all JOIN lessons"""
    
    lesson_dir = "backend/lesson-content"
    join_lessons = [
        "lesson_inner-join.json",
        "lesson_left-join.json",
        "lesson_right-join.json",
        "lesson_full-join.json",
        "lesson_cross-join.json",
        "lesson_self-join.json"
    ]
    
    print("Adding visual diagrams to JOIN lessons...")
    print("=" * 50)
    
    for lesson_file in join_lessons:
        lesson_path = os.path.join(lesson_dir, lesson_file)
        lesson_id = lesson_file.replace("lesson_", "").replace(".json", "")
        
        if os.path.exists(lesson_path):
            add_visual_to_lesson(lesson_id, lesson_path)
        else:
            print(f"❌ File not found: {lesson_path}")
    
    print("=" * 50)
    print("✨ Done! All JOIN lessons now have visual diagrams.")

if __name__ == "__main__":
    main()
