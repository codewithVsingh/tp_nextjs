

# Complete URL Inventory Extraction

## What I'll Do
Run a script that imports the project's route definitions and SEO data generation logic, then outputs a fully categorized URL list with counts to a downloadable document.

## Categories & Estimated Counts

| Category | Count |
|---|---|
| **Core/Static Pages** | 10 |
| **Blog Posts** | 10 |
| **Legacy: Subject-Delhi** | 13 |
| **Legacy: Area-Delhi** | 30 |
| **Legacy: Subject-Area-Delhi** | 36 |
| **v1.0: Home Tuition in Area** | 30 |
| **v1.0: Home Tuition Area+Pincode** | 15 |
| **v1.0: Best Home Tutors in Area** | 15 |
| **v1.0: Subject-Class-Area** | 300 |
| **v2.0: Money Pages (Fees)** | 30 |
| **v2.0: Money Pages (Top 10)** | 30 |
| **v2.0: Board-Specific** | 360 |
| **v2.0: Female Tutor** | 90 |
| **v2.0: Near Me** | 30 |
| **v2.0: Home vs Online** | 15 |
| **v2.0: Subject Fees** | 60 |
| **v2.0: Exam Coaching** | 112 |
| **TOTAL** | **~1,186** |

## Implementation
1. Write a Node.js script that programmatically generates every URL from `seoData.ts` (`getAllSlugs()`), blog slugs, and static routes
2. Output a categorized CSV/text file to `/mnt/documents/url-inventory.csv` with columns: Category, URL, Page Type
3. Print summary counts per category

## Output
- A downloadable CSV with all ~1,186 URLs categorized
- A summary table with counts per category

