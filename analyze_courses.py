#!/usr/bin/env python3
"""Analyze course enrollment from the combined CSV"""

import pandas as pd
import os
from collections import Counter

def analyze_courses(csv_file):
    """Analyze which courses have the most students"""
    
    # Read the CSV
    df = pd.read_csv(csv_file)
    
    # Count students per course
    # Since courses are comma-separated, we need to split them
    course_counts = Counter()
    
    for _, row in df.iterrows():
        courses = str(row['Course']).split(',')
        for course in courses:
            course = course.strip()
            if course:  # Skip empty courses
                course_counts[course] += 1
    
    # Sort by count (descending)
    sorted_courses = sorted(course_counts.items(), key=lambda x: x[1], reverse=True)
    
    print("="*80)
    print("COURSE ENROLLMENT ANALYSIS")
    print("="*80)
    print(f"\nTotal unique students: {len(df)}")
    print(f"Total course enrollments: {sum(course_counts.values())}")
    print(f"Average courses per student: {sum(course_counts.values()) / len(df):.2f}\n")
    
    print("TOP COURSES BY ENROLLMENT:")
    print("-"*80)
    print(f"{'Rank':<6} {'Students':<10} {'Course Name'}")
    print("-"*80)
    
    for rank, (course, count) in enumerate(sorted_courses, 1):
        percentage = (count / len(df)) * 100
        print(f"{rank:<6} {count:<10} {course} ({percentage:.1f}%)")
        
        # Show top 30 courses
        if rank >= 30:
            break
    
    print("\n" + "="*80)
    
    # Also show courses with email addresses
    print("\nENROLLMENT WITH EMAIL ADDRESSES:")
    print("-"*80)
    email_course_counts = Counter()
    
    for _, row in df.iterrows():
        if pd.notna(row['Email Address']) and str(row['Email Address']).strip():
            courses = str(row['Course']).split(',')
            for course in courses:
                course = course.strip()
                if course:
                    email_course_counts[course] += 1
    
    sorted_email_courses = sorted(email_course_counts.items(), key=lambda x: x[1], reverse=True)
    
    print(f"{'Rank':<6} {'Students':<10} {'Course Name'}")
    print("-"*80)
    for rank, (course, count) in enumerate(sorted_email_courses, 1):
        percentage = (count / len(df[df['Email Address'].str.len() > 0])) * 100
        print(f"{rank:<6} {count:<10} {course} ({percentage:.1f}%)")
        
        if rank >= 30:
            break
    
    print("\n" + "="*80)

if __name__ == '__main__':
    csv_file = os.path.expanduser('~/Downloads/alumnos_combined.csv')
    
    if not os.path.exists(csv_file):
        print(f"Error: File not found: {csv_file}")
        print("Please run process_alumnos.py first to generate the CSV file.")
        exit(1)
    
    analyze_courses(csv_file)



