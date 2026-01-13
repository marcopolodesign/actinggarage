#!/usr/bin/env python3
"""Analyze course enrollment excluding generic sheet names"""

import pandas as pd
import os
from collections import Counter

def analyze_courses_detailed(csv_file):
    """Analyze which courses have the most students, excluding generic names"""
    
    # Read the CSV
    df = pd.read_csv(csv_file)
    
    # Generic sheet names to exclude (like "Hoja 7", "Hoja2", etc.)
    exclude_patterns = ['Hoja', 'DESGLOSE', 'A PARTIR']
    
    # Count students per course
    course_counts = Counter()
    course_counts_with_email = Counter()
    
    for _, row in df.iterrows():
        courses = str(row['Course']).split(',')
        has_email = pd.notna(row['Email Address']) and str(row['Email Address']).strip()
        
        for course in courses:
            course = course.strip()
            if course:
                # Skip generic sheet names
                if any(pattern in course for pattern in exclude_patterns):
                    continue
                    
                course_counts[course] += 1
                if has_email:
                    course_counts_with_email[course] += 1
    
    # Sort by count (descending)
    sorted_courses = sorted(course_counts.items(), key=lambda x: x[1], reverse=True)
    sorted_email_courses = sorted(course_counts_with_email.items(), key=lambda x: x[1], reverse=True)
    
    print("="*80)
    print("TOP PERFORMING COURSES (excluding generic sheet names)")
    print("="*80)
    print(f"\nTotal unique students: {len(df)}")
    print(f"Total course enrollments (excluding generic sheets): {sum(course_counts.values())}\n")
    
    print("TOP 20 COURSES BY ENROLLMENT:")
    print("-"*80)
    print(f"{'Rank':<6} {'Students':<10} {'% of Total':<12} {'Course Name'}")
    print("-"*80)
    
    total_enrollments = sum(course_counts.values())
    
    for rank, (course, count) in enumerate(sorted_courses[:20], 1):
        percentage = (count / len(df)) * 100
        print(f"{rank:<6} {count:<10} {percentage:>6.1f}%      {course}")
    
    print("\n" + "-"*80)
    print("\nTOP 20 COURSES BY ENROLLMENT (WITH EMAIL ADDRESSES):")
    print("-"*80)
    print(f"{'Rank':<6} {'Students':<10} {'% of Email':<12} {'Course Name'}")
    print("-"*80)
    
    students_with_email = len(df[df['Email Address'].str.len() > 0])
    
    for rank, (course, count) in enumerate(sorted_email_courses[:20], 1):
        percentage = (count / students_with_email) * 100
        print(f"{rank:<6} {count:<10} {percentage:>6.1f}%      {course}")
    
    print("\n" + "="*80)
    
    # Show top 3 courses with details
    print("\n🏆 TOP 3 PERFORMING COURSES:")
    print("-"*80)
    for rank, (course, count) in enumerate(sorted_courses[:3], 1):
        email_count = course_counts_with_email.get(course, 0)
        percentage = (count / len(df)) * 100
        print(f"\n{rank}. {course}")
        print(f"   • Total students: {count}")
        print(f"   • Students with email: {email_count}")
        print(f"   • Percentage of all students: {percentage:.1f}%")
    
    print("\n" + "="*80)

if __name__ == '__main__':
    csv_file = os.path.expanduser('~/Downloads/alumnos_combined.csv')
    
    if not os.path.exists(csv_file):
        print(f"Error: File not found: {csv_file}")
        exit(1)
    
    analyze_courses_detailed(csv_file)



