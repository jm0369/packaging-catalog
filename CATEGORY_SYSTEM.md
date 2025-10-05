# Category System Documentation

## Overview
The category system allows you to organize article groups with color-coded categories. Categories can be assigned to multiple groups, and each group can have multiple categories.

## Admin Pages

### Categories Management (`/categories`)
- **List all categories** with group counts and color preview
- **Create new categories** with name and color picker
- **Edit categories** - update name and color
- **Delete categories** - removes category and all group assignments
- **View assigned groups** for each category

### Groups Management
- **Groups list** (`/groups`) - displays categories for each group
- **Group detail** (`/groups/:externalId`) - manage categories directly on the group page
  - Add categories via dropdown
  - Remove categories with one click
  - Categories displayed as color-coded badges

## API Endpoints

### Public Endpoints
- `GET /api/article-groups` - Lists groups with their categories
- `GET /api/article-groups/:externalId` - Get single group with categories

### Admin Endpoints (require `x-admin-secret` header)

#### Categories CRUD
- `GET /admin/categories` - List all categories
- `GET /admin/categories/:id` - Get category with assigned groups
- `POST /admin/categories` - Create category
  - Body: `{ name: string, color: string }`
- `PATCH /admin/categories/:id` - Update category
  - Body: `{ name?: string, color?: string }`
- `DELETE /admin/categories/:id` - Delete category

#### Category-Group Assignment
- `POST /admin/categories/:id/groups/:groupId` - Assign category to group
- `DELETE /admin/categories/:id/groups/:groupId` - Remove category from group
- `GET /admin/article-groups/:externalId/categories` - List categories for a group
- `POST /admin/article-groups/:externalId/categories` - Assign category to group
  - Body: `{ categoryId: string }`
- `DELETE /admin/article-groups/:externalId/categories/:categoryId` - Remove category

## Database Schema

### Models
- **Category** - id, name (unique), color
- **GroupCategoryLink** - Junction table for many-to-many relationship
  - Unique constraint on (groupId, categoryId)
  - Cascade delete on both sides

## Features
✅ Color-coded category badges
✅ Many-to-many relationship (groups ↔ categories)
✅ Duplicate prevention
✅ Cascade deletion
✅ Admin authentication
✅ Full CRUD operations
✅ Two-way management (from category or group perspective)

## Usage Example

1. **Create categories** at `/categories/new`
   - e.g., "Packaging" with blue color #3B82F6
   - e.g., "Labels" with green color #10B981

2. **Assign to groups** at `/groups/:externalId`
   - Select category from dropdown
   - Click "Add"

3. **View in public API**
   ```json
   {
     "id": "...",
     "name": "Product Name",
     "categories": [
       { "id": "...", "name": "Packaging", "color": "#3B82F6" }
     ]
   }
   ```
