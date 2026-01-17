#!/usr/bin/env python3
"""
Parse FY2027 budget CSV and convert to standard format.
Normalizes flood debt from Public Works back to General Government.
"""

import csv
import re
from pathlib import Path

INPUT_FILE = Path("/Users/mrki/misc/town-budgets/proposed_budgets/2026+2027/FY27 Budget TEST A.xlsx - 2027 BUDGET.csv")
OUTPUT_FILE = Path("/Users/mrki/misc/town-budgets/website/public/data/provisional_2025.csv")

# Section mapping from source to standard names
SECTION_MAPPING = {
    "GENERAL GOVERNMENT": "General Government",
    "ADMINISTRATION": "Administration",
    "LISTERS": "Administration",  # Listers are part of Administration
    "TOWN HALL BUILDING": "Town Hall",
    "TOWN HALL": "Town Hall",
    "PUBLIC SAFETY": "Public Safety",
    "FIRE DEPARTMENT": "Fire Department",
    "FIRE DEPARTMENT DEBT SERVICE": "Fire Department Debt Service",
    "PUBLIC WORKS": "Public Works",
    "Winter Maintenance": "Winter Maintenance",
    "Summer Maintenance": "Summer Maintenance",
    "Equipment Maintenance": "Equipment Maintenance",
    "Specialized Services": "Specialized Services",
    "Garage Maintenance": "Garage Maintenance",
    "Utilities": "Utilities",
    "Gas & Diesel": "Gas & Diesel",
    "Wages & Benefits": "Wages & Benefits",
    "HWY/MISC": "HWY/MISC",
    "CONSTRUCTION": "Construction",
    "Flood Disaster-Unbudgeted": "Flood Disaster-Unbudgeted",
    "PUBLIC WORKS DEBT SERVICE": "Public Works Debt Service",
    "CEMETERY": "Cemetery",
    "RECREATION": "Recreation",
    "ZONING/DRB": "Zoning/DRB",
    "PLANNING COMMISSION": "Planning Commission",
    "CIP FUNDING(Capital Improvement Planning)": "CIP",
    "SPECIAL ARTICLES": "Special Articles",
}

def parse_currency(value):
    """Parse currency string like '$ 1,234.56' to float."""
    if not value or value.strip() == "":
        return None
    # Remove $, spaces, commas, and parentheses (for negative)
    cleaned = re.sub(r'[\$,\s]', '', value.strip())
    if cleaned == "" or cleaned == "-":
        return 0.0
    # Handle parentheses for negative numbers
    if cleaned.startswith('(') and cleaned.endswith(')'):
        cleaned = '-' + cleaned[1:-1]
    try:
        return float(cleaned)
    except ValueError:
        return None

def main():
    rows = []
    current_section = None

    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)

        for row in reader:
            if len(row) < 5:
                continue

            line_item = row[0].strip()

            # Skip header rows
            if not line_item or line_item.startswith("2026/2027Budget"):
                continue
            if "July 1" in line_item:
                continue

            # Check if this is a section header
            upper_item = line_item.upper()
            if upper_item in [k.upper() for k in SECTION_MAPPING.keys()]:
                # Find matching key
                for key in SECTION_MAPPING.keys():
                    if key.upper() == upper_item:
                        current_section = SECTION_MAPPING[key]
                        break
                continue

            # Check for subsection headers in Public Works
            if line_item in ["Winter Maintenance", "Summer Maintenance", "Equipment Maintenance",
                            "Specialized Services", "Garage Maintenance", "Utilities",
                            "Gas & Diesel", "Wages & Benefits", "HWY/MISC", "CONSTRUCTION",
                            "Flood Disaster-Unbudgeted", "GeneralGovernment", "Highway:",
                            "Public Safety/Fire Deparment", "Recreation:"]:
                if line_item in SECTION_MAPPING:
                    current_section = SECTION_MAPPING[line_item]
                continue

            # Skip empty rows and totals we don't need line-by-line
            if not current_section:
                continue

            # Skip TOTAL and Subtotal rows (they cause double-counting)
            lower_item = line_item.lower()
            if (lower_item.startswith("total") or
                "sub total" in lower_item or
                "sub-total" in lower_item or
                "subtotal" in lower_item or
                lower_item.endswith("subtotal") or
                lower_item.startswith("total:") or
                " total" in lower_item and line_item.endswith(current_section)):
                continue

            # Parse values
            # Column 1: Budget FY 2024/2025 -> fiscal_year 2025
            # Column 2: Actual FY 2024/2025 -> fiscal_year 2025 actual
            # Column 3: Budget FY 2025/2026 -> fiscal_year 2026
            # Column 4: Budget FY 2026/2027 -> fiscal_year 2027

            budget_2025 = parse_currency(row[1]) if len(row) > 1 else None
            actual_2025 = parse_currency(row[2]) if len(row) > 2 else None
            budget_2026 = parse_currency(row[3]) if len(row) > 3 else None
            budget_2027 = parse_currency(row[4]) if len(row) > 4 else None

            # Skip rows with no budget data
            if all(v is None or v == 0 for v in [budget_2025, actual_2025, budget_2026, budget_2027]):
                continue

            # Handle flood debt normalization:
            # Move "Flood Disaster - Principal& Interest" from Public Works to General Government
            if "Flood Disaster" in line_item and "Principal" in line_item:
                # This should go to General Government, not Public Works
                rows.append(("General Government", "Flood Debt: Principal & Interest", 2025, budget_2025, actual_2025))
                rows.append(("General Government", "Flood Debt: Principal & Interest", 2026, budget_2026, None))
                rows.append(("General Government", "Flood Debt: Principal & Interest", 2027, budget_2027, None))
                continue

            # Add rows for each fiscal year
            if budget_2025 is not None or actual_2025 is not None:
                rows.append((current_section, line_item, 2025, budget_2025, actual_2025))
            if budget_2026 is not None:
                rows.append((current_section, line_item, 2026, budget_2026, None))
            if budget_2027 is not None:
                rows.append((current_section, line_item, 2027, budget_2027, None))

    # Write output
    with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['section', 'line_item', 'fiscal_year', 'budgeted', 'actual'])
        for row in rows:
            section, line_item, fy, budgeted, actual = row
            writer.writerow([
                section,
                line_item,
                fy,
                budgeted if budgeted is not None else '',
                actual if actual is not None else ''
            ])

    print(f"Wrote {len(rows)} rows to {OUTPUT_FILE}")

    # Print summary by section and year
    from collections import defaultdict
    totals = defaultdict(lambda: defaultdict(float))
    for section, line_item, fy, budgeted, actual in rows:
        if budgeted:
            totals[section][fy] += budgeted

    print("\nSection totals:")
    for section in sorted(totals.keys()):
        print(f"  {section}:")
        for fy in sorted(totals[section].keys()):
            print(f"    FY{fy}: ${totals[section][fy]:,.0f}")

if __name__ == "__main__":
    main()
