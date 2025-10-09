# Media Asset Connection Management - Implementation Summary

## Overview
Extended the media asset management system to allow managing connections (links) between media assets and articles/groups directly from the media detail page.

## New Features

### Backend API Routes (NestJS)

#### MediaAssetsController Extensions
**File:** `apps/api/src/routes/admin/media.controller.ts`

Added 4 new endpoints:

1. **POST `/admin/media-assets/:id/link-to-group`**
   - Links a media asset to a group
   - Body: `{ groupExternalId: string, altText?: string, sortOrder?: number }`
   - Auto-calculates sortOrder if not provided (appends to end)
   - Prevents duplicate links
   - Returns the created link with group details

2. **POST `/admin/media-assets/:id/link-to-article`**
   - Links a media asset to an article
   - Body: `{ articleExternalId: string, altText?: string, sortOrder?: number }`
   - Auto-calculates sortOrder if not provided (appends to end)
   - Prevents duplicate links
   - Returns the created link with article details

3. **DELETE `/admin/media-assets/:id/unlink-from-group/:linkId`**
   - Removes a link between media asset and group
   - Validates that the link belongs to the media asset
   - Returns success message

4. **DELETE `/admin/media-assets/:id/unlink-from-article/:linkId`**
   - Removes a link between media asset and article
   - Validates that the link belongs to the media asset
   - Returns success message

### Frontend API Routes (Next.js)

Created proxy routes to handle authentication:

1. **`apps/admin/src/app/api/media/[id]/link-to-group/route.ts`**
   - POST endpoint to link media to group
   
2. **`apps/admin/src/app/api/media/[id]/link-to-article/route.ts`**
   - POST endpoint to link media to article

3. **`apps/admin/src/app/api/media/[id]/unlink-from-group/[linkId]/route.ts`**
   - DELETE endpoint to remove group link

4. **`apps/admin/src/app/api/media/[id]/unlink-from-article/[linkId]/route.ts`**
   - DELETE endpoint to remove article link

All routes use `adminFetch` helper to include admin authentication.

### React Client Components

#### 1. AddGroupLink Component
**File:** `apps/admin/src/components/media/add-group-link.tsx`

Features:
- Toggle button to show/hide form
- Input for group external ID
- Optional alt text input
- Form validation
- Error handling
- Refresh on success

#### 2. AddArticleLink Component
**File:** `apps/admin/src/components/media/add-article-link.tsx`

Features:
- Toggle button to show/hide form
- Input for article external ID
- Optional alt text input
- Form validation
- Error handling
- Refresh on success

#### 3. RemoveLinkButton Component
**File:** `apps/admin/src/components/media/remove-link-button.tsx`

Features:
- Confirmation dialog before deletion
- Handles both group and article links
- Error handling
- Disabled state during operation
- Refresh on success

#### 4. MediaAssetDetailClient Component
**File:** `apps/admin/src/components/media/media-asset-detail-client.tsx`

Complete redesign of the detail page as a client component:
- Moved all UI logic from server component
- Integrated connection management components
- Uses `useRouter().refresh()` to reload data after changes
- Organized sections:
  - Image preview and metadata (unchanged)
  - Connected Groups section (with add/remove)
  - Connected Articles section (with add/remove)
  - Categories section (read-only)

### Updated Pages

**File:** `apps/admin/src/app/(authenticated)/media/[id]/page.tsx`

Simplified to:
- Fetch data server-side
- Pass data to client component
- Keep page as server component for data fetching

## User Flow

### Adding a Connection

1. Navigate to media asset detail page (`/media/:id`)
2. Scroll to "Connected Groups" or "Connected Articles" section
3. Click "+ Add Group Connection" or "+ Add Article Connection"
4. Enter the external ID of the group/article
5. Optionally add alt text
6. Click "Add Connection"
7. Page refreshes and new connection appears in the list

### Removing a Connection

1. In the connections list, find the item to remove
2. Click "Remove" button
3. Confirm in the dialog
4. Connection is removed and page refreshes

## Validation & Error Handling

### Backend Validations
- ✅ Media asset must exist
- ✅ Target group/article must exist (by external ID)
- ✅ Prevents duplicate connections
- ✅ Validates link ownership before deletion

### Frontend Error Handling
- ✅ Display error messages inline
- ✅ Disable buttons during operations
- ✅ Confirmation dialogs for destructive actions
- ✅ Network error handling

## Technical Highlights

### Smart SortOrder Management
- Automatically appends new links to the end
- Queries for current max sortOrder
- Handles empty lists (starts at 0)

### Type Safety
- Full TypeScript typing across frontend and backend
- Shared type definitions for media asset structure
- Props validation for all components

### State Management
- Uses Next.js router.refresh() for data updates
- No need for complex client-side state
- Server-side data fetching ensures consistency

### UI/UX Features
- Inline error messages
- Loading states on buttons
- Collapsible add forms
- Clear visual hierarchy
- Responsive layout
- Confirmation dialogs for safety

## API Examples

### Link to Group
```bash
POST /admin/media-assets/{mediaId}/link-to-group
Headers: x-admin-secret: <secret>
Body: {
  "groupExternalId": "GROUP123",
  "altText": "Product image"
}
```

### Link to Article
```bash
POST /admin/media-assets/{mediaId}/link-to-article
Headers: x-admin-secret: <secret>
Body: {
  "articleExternalId": "ART456",
  "altText": "Product detail"
}
```

### Unlink from Group
```bash
DELETE /admin/media-assets/{mediaId}/unlink-from-group/{linkId}
Headers: x-admin-secret: <secret>
```

## Categories Note

Categories are shown as read-only in the media detail page. Connection management for categories would need to be done from the category management pages (out of scope for this feature).

## Testing Checklist

- [ ] Add group connection with valid external ID
- [ ] Add article connection with valid external ID
- [ ] Try adding duplicate connection (should fail)
- [ ] Add connection with invalid external ID (should fail)
- [ ] Remove group connection
- [ ] Remove article connection
- [ ] Add connection with alt text
- [ ] Add connection without alt text
- [ ] Check that sortOrder increments correctly
- [ ] Verify page refreshes after operations
- [ ] Test error messages display correctly
- [ ] Confirm deletion dialogs work

## Future Enhancements (Not Implemented)

- Search/autocomplete for group/article IDs
- Reorder connections (drag and drop)
- Edit alt text inline
- Set primary image from media detail page
- Bulk operations
- Connection history/audit log
- Preview of how image appears in group/article
