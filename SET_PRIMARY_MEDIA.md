# Set Primary Media Asset - Implementation Summary

## Overview
Added the ability to set a media asset as the primary (featured) image for each connected group, article, and category individually. The primary image is determined by sortOrder = 0.

## Features

### Backend API
The existing API endpoints in these controllers already support setting primary:
- **POST** `/admin/article-groups/:externalId/media/:linkId/primary` (GroupsMediaController)
- **POST** `/admin/articles/:externalId/media/:linkId/primary` (ArticlesMediaController)  
- **POST** `/admin/categories/:categoryId/media/:linkId/primary` (CategoriesMediaController)

These endpoints:
1. Set the target link's sortOrder to -1 (temporary sentinel)
2. Increment all other links' sortOrder by 1
3. Set the target link's sortOrder to 0 (making it primary)
4. This ensures the primary image always has sortOrder = 0

### Frontend API Routes

Created/verified proxy routes:
1. `/api/groups/[externalId]/media/[linkId]/primary/route.ts` (already existed)
2. `/api/articles/[externalId]/media/[linkId]/primary/route.ts` (already existed)
3. `/api/categories/[categoryId]/media/[linkId]/primary/route.ts` (newly created)

### React Components

#### SetPrimaryButton Component
**File:** `apps/admin/src/components/media/set-primary-button.tsx`

A smart button that:
- Shows **"★ Primary"** badge (green) when `sortOrder === 0`
- Shows **"⭐ Set Primary"** button (clickable) when not primary
- Handles all three types: group, article, category
- Provides loading states ("Setting...")
- Shows error messages inline
- Triggers page refresh on success

Props:
```typescript
{
  linkId: string;           // The link ID to set as primary
  linkType: 'group' | 'article' | 'category';
  entityId: string;         // externalId for group/article, id for category
  isPrimary: boolean;       // Whether this is currently primary (sortOrder === 0)
  onSuccess: () => void;    // Callback to refresh data
}
```

#### Updated MediaAssetDetailClient
**File:** `apps/admin/src/components/media/media-asset-detail-client.tsx`

Enhanced all three connection sections (Groups, Articles, Categories) to:
- Show sort order and SetPrimaryButton together
- Display primary status prominently
- Allow one-click promotion to primary

## UI Layout

Each connection now displays:

```
┌────────────────────────────────────────────────────────┐
│ Group/Article/Category Name                            │
│ External ID / Type info                                │
│ Alt text: [if present]                                 │
│ Sort order: 0  [★ Primary]          View → | Remove   │ <- Primary
│ Sort order: 1  [⭐ Set Primary]     View → | Remove   │ <- Not primary
└────────────────────────────────────────────────────────┘
```

## User Flow

### Setting an Image as Primary

1. Navigate to media asset detail page (`/media/:id`)
2. Find the connection you want to promote
3. Click **"⭐ Set Primary"** next to the sort order
4. The button shows "Setting..." during operation
5. Page refreshes automatically
6. The image now shows **"★ Primary"** badge
7. Other images' sort orders are incremented automatically

### Visual Indicators

- **Primary image**: Green badge with "★ Primary"
- **Non-primary image**: Blue link with "⭐ Set Primary"
- Sort order displayed for reference

## Technical Details

### How Primary Works

The primary image is always the one with `sortOrder = 0`. When you set a different image as primary:

1. API sets target link to sortOrder = -1 (temporary)
2. All other links increment by 1
3. Target link set to sortOrder = 0
4. Previous primary is now sortOrder = 1

This ensures:
- Only one primary image per entity
- No sortOrder conflicts
- Atomic transaction (all-or-nothing)

### Type Safety

Full TypeScript support:
- Props validation
- Type-safe API calls
- Proper error handling

### State Management

- Uses `router.refresh()` to reload all data
- Server-side data ensures consistency
- No complex client state needed

## Example Scenarios

### Scenario 1: Group with Multiple Images
```
Group: "Premium Boxes"
├── Image A (sortOrder: 0) [★ Primary]
├── Image B (sortOrder: 1) [⭐ Set Primary]
└── Image C (sortOrder: 2) [⭐ Set Primary]

User clicks "Set Primary" on Image B:
├── Image B (sortOrder: 0) [★ Primary]
├── Image A (sortOrder: 1) [⭐ Set Primary]
└── Image C (sortOrder: 2) [⭐ Set Primary]
```

### Scenario 2: Article with One Image
```
Article: "Box Product"
└── Image A (sortOrder: 0) [★ Primary]

(Already primary, no action needed)
```

### Scenario 3: Category with New Image
```
Category: "Shipping Boxes"
├── Image A (sortOrder: 0) [★ Primary]

User adds new Image B (automatically sortOrder: 1):
├── Image A (sortOrder: 0) [★ Primary]
└── Image B (sortOrder: 1) [⭐ Set Primary]

User clicks "Set Primary" on Image B:
├── Image B (sortOrder: 0) [★ Primary]
└── Image A (sortOrder: 1) [⭐ Set Primary]
```

## API Examples

### Set Group Primary
```bash
POST /api/groups/GROUP123/media/link-uuid-123/primary
# Auto-increments other images and sets this to sortOrder: 0
```

### Set Article Primary
```bash
POST /api/articles/ART456/media/link-uuid-456/primary
# Auto-increments other images and sets this to sortOrder: 0
```

### Set Category Primary
```bash
POST /api/categories/cat-uuid-789/media/link-uuid-789/primary
# Auto-increments other images and sets this to sortOrder: 0
```

## Benefits

### For Users
- ✅ Clear visual indication of primary image
- ✅ One-click to promote any image
- ✅ No manual sortOrder management
- ✅ Consistent across groups, articles, categories

### For Developers
- ✅ Reuses existing API endpoints
- ✅ Clean component architecture
- ✅ Type-safe implementation
- ✅ Atomic transactions prevent data corruption

## Testing Checklist

### Groups
- [ ] Set primary on group with multiple images
- [ ] Verify other images increment their sortOrder
- [ ] Check primary badge appears correctly
- [ ] Test with single image (should show as primary)

### Articles
- [ ] Set primary on article with multiple images
- [ ] Verify other images increment their sortOrder
- [ ] Check primary badge appears correctly
- [ ] Test with single image (should show as primary)

### Categories
- [ ] Set primary on category with multiple images
- [ ] Verify other images increment their sortOrder
- [ ] Check primary badge appears correctly
- [ ] Test with single image (should show as primary)

### General
- [ ] Error handling displays properly
- [ ] Loading states work during API calls
- [ ] Page refreshes after successful operation
- [ ] Primary badge only shows for sortOrder = 0
- [ ] Button only shows for sortOrder > 0

## Future Enhancements (Not Implemented)

- Drag-and-drop to reorder all images at once
- Keyboard shortcuts for setting primary
- Preview of primary image in listing
- Bulk set primary across multiple entities
- History of primary image changes
