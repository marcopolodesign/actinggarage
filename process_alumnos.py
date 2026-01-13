#!/usr/bin/env python3
"""
Process Excel file with multiple sheets and create a CSV with:
- First Name
- Last Name  
- Email
- Course (sheet name)
"""

import pandas as pd
import sys
import os

def process_excel_file(input_file, output_file):
    """
    Read all sheets from Excel file and combine into a single CSV
    The Excel structure is:
    - Row 0: Title/Header row
    - Row 1: Column headers (FOTO ALUMNO, Nº, Nº Matricula, NOMBRE, APELLIDO, EDAD, TELéFONO, E-MAIL, ...)
    - Row 2+: Data rows
    - Column index 3: NOMBRE (First name)
    - Column index 4: APELLIDO (Last name)
    - Column index 7: E-MAIL (Email)
    """
    # Read all sheets
    excel_file = pd.ExcelFile(input_file)
    
    all_data = []
    
    print(f"Found {len(excel_file.sheet_names)} sheets")
    
    # Process each sheet
    for sheet_idx, sheet_name in enumerate(excel_file.sheet_names):
        print(f"\n[{sheet_idx+1}/{len(excel_file.sheet_names)}] Processing: {sheet_name}")
        
        try:
            # Read the sheet without headers
            df = pd.read_excel(excel_file, sheet_name=sheet_name, header=None)
            
            # Find the header row (row containing "NOMBRE")
            header_row_idx = None
            for idx in range(min(5, len(df))):  # Check first 5 rows
                row_values = df.iloc[idx].astype(str).values
                if any('NOMBRE' in str(val).upper() for val in row_values):
                    header_row_idx = idx
                    break
            
            if header_row_idx is None:
                print(f"  ⚠ Skipping: Could not find header row with 'NOMBRE'")
                continue
            
            # Extract data starting from row after header
            data_start_row = header_row_idx + 1
            rows_extracted = 0
            
            for idx in range(data_start_row, len(df)):
                row = df.iloc[idx]
                
                # Extract from fixed column indices
                # Column 3: NOMBRE (First name)
                # Column 4: APELLIDO (Last name)
                # Column 7: E-MAIL (Email)
                
                first_name = ''
                if len(row) > 3 and pd.notna(row.iloc[3]):
                    first_name = str(row.iloc[3]).strip()
                    if first_name == 'nan' or first_name == '' or first_name.upper() in ['NOMBRE', 'APELLIDO', 'CÁMARA', 'TEATRO', 'PROFESOR/A', 'PROFESOR:', 'PROFESORA :']:
                        continue  # Skip header rows or invalid data
                
                last_name = ''
                if len(row) > 4 and pd.notna(row.iloc[4]):
                    last_name = str(row.iloc[4]).strip()
                    if last_name == 'nan':
                        last_name = ''
                
                email = ''
                if len(row) > 7 and pd.notna(row.iloc[7]):
                    email = str(row.iloc[7]).strip()
                    if email == 'nan':
                        email = ''
                    # Validate email format (basic check)
                    if email and '@' not in email:
                        email = ''
                
                # Filter out invalid entries
                # Skip if first_name contains invalid patterns (section headers, labels, etc.)
                invalid_patterns = [
                    'BAJAS', 'SOLO ', 'TODO ESTE', 'EXPULSADA', 'SE TIENE QUE IR',
                    'AMIGAS QUE', 'PRO ', 'LABORATORIO', 'HERRAMIENTAS', 'CÁMARA ',
                    'TEATRO ', 'CANTO ', 'INTERPRETACIÓN', 'CREACIÓN', 'MONTAJE',
                    'IMPROVISACIÓN', 'PROFESOR', 'PROFESORA', 'GRUPO', 'AULA',
                    'NO PUEDEN', 'NO PODRÁ', 'MANDO UN MAIL', 'LO DEJA', 'DEJA EL CURSO',
                    'NO PUEDE SEGUIR', 'CAMARA CON', 'NI IDEA', 'NOMBRE (WT', 'NOMBRE (WHAT',
                    'CON SERGI', 'CON TONY', 'CON ', 'CONSTANZA', 'MARIA VORONKOVA'
                ]
                
                if first_name:
                    first_name_upper = first_name.upper()
                    # Skip if it's just numbers
                    if first_name.replace(' ', '').replace(',', '').isdigit():
                        continue
                    # Skip if contains invalid patterns
                    if any(pattern in first_name_upper for pattern in invalid_patterns):
                        continue
                    # Skip if first name is too long (likely descriptive text, not a name)
                    # Most names are less than 50 characters
                    if len(first_name) > 50:
                        continue
                
                # Only add row if we have at least a first name or email
                if first_name or email:
                    all_data.append({
                        'First Name': first_name,
                        'Last Name': last_name,
                        'Email Address': email,
                        'Course': sheet_name
                    })
                    rows_extracted += 1
            
            print(f"  ✓ Extracted {rows_extracted} records")
            
        except Exception as e:
            print(f"  ✗ Error processing sheet: {str(e)}")
            import traceback
            traceback.print_exc()
            continue
    
    # Create DataFrame and save to CSV
    if all_data:
        result_df = pd.DataFrame(all_data)
        
        # Filter out rows with no meaningful data
        result_df = result_df[
            (result_df['First Name'].str.len() > 0) | 
            (result_df['Email Address'].str.len() > 0)
        ]
        
        # Additional filtering: remove rows where first name is too short or looks invalid
        # (less than 2 characters, or is just numbers)
        result_df = result_df[
            (result_df['First Name'].str.len() >= 2) | 
            (result_df['Email Address'].str.len() > 0)
        ]
        
        # Group by email address (or by name if no email) and combine courses
        # Create a key for grouping: email if available, otherwise first_name + last_name
        result_df['group_key'] = result_df.apply(
            lambda row: row['Email Address'] if row['Email Address'] and row['Email Address'].strip() else 
                       f"{row['First Name']}|{row['Last Name']}", 
            axis=1
        )
        
        # Group and aggregate
        def combine_courses(group):
            # Get the first non-empty values for name fields
            first_name = group['First Name'].dropna().iloc[0] if not group['First Name'].dropna().empty else ''
            last_name = group['Last Name'].dropna().iloc[0] if not group['Last Name'].dropna().empty else ''
            email = group['Email Address'].dropna().iloc[0] if not group['Email Address'].dropna().empty else ''
            
            # Combine unique courses
            courses = group['Course'].dropna().unique().tolist()
            courses_str = ', '.join(sorted(courses))  # Sort for consistency
            
            return pd.Series({
                'First Name': first_name,
                'Last Name': last_name,
                'Email Address': email,
                'Course': courses_str
            })
        
        # Group by the key and combine
        result_df = result_df.groupby('group_key').apply(combine_courses).reset_index(drop=True)
        
        # Remove the temporary group_key column (it's already removed by the groupby)
        
        # Save to CSV
        result_df.to_csv(output_file, index=False, encoding='utf-8')
        print(f"\n{'='*60}")
        print(f"✓ Successfully created: {output_file}")
        print(f"  Total unique records: {len(result_df)}")
        print(f"  Records with email: {len(result_df[result_df['Email Address'].str.len() > 0])}")
        print(f"  Records with first name: {len(result_df[result_df['First Name'].str.len() > 0])}")
        print(f"  Records with multiple courses: {len(result_df[result_df['Course'].str.contains(',')])}")
        print(f"{'='*60}")
    else:
        print("\n✗ No data found to export")
        sys.exit(1)


if __name__ == '__main__':
    input_file = os.path.expanduser('~/Downloads/ALUMNOS TAG 25 26.xlsx')
    output_file = os.path.join(os.path.dirname(input_file), 'alumnos_combined.csv')
    
    if not os.path.exists(input_file):
        print(f"Error: File not found: {input_file}")
        sys.exit(1)
    
    process_excel_file(input_file, output_file)

