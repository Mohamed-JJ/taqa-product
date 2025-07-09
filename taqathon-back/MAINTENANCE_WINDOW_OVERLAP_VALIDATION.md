# Maintenance Window Overlap Validation

## Overview
The maintenance window system now includes comprehensive overlap validation to prevent scheduling conflicts between maintenance windows.

## Features

### 1. Create Validation
When creating a new maintenance window, the system checks for overlaps with existing windows:
- Returns HTTP 409 CONFLICT if an overlap is detected
- Provides detailed error message listing conflicting windows

### 2. Update Validation
When updating an existing maintenance window's schedule, the system:
- Checks for overlaps with other windows (excluding the current window)
- Returns HTTP 409 CONFLICT if an overlap is detected
- Provides detailed error message listing conflicting windows

## Overlap Detection Logic

The system detects overlaps using the following scenarios:

### 1. New Window Starts During Existing Window
```
Existing: |---------|
New:         |---------|
```

### 2. New Window Ends During Existing Window
```
Existing:    |---------|
New:      |---------|
```

### 3. New Window Completely Contains Existing Window
```
Existing:    |-----|
New:      |-----------|
```

### 4. Existing Window Completely Contains New Window
```
Existing: |-----------|
New:         |-----|
```

## API Endpoints

### Create Maintenance Window
- **Endpoint:** `POST /maintenance-windows`
- **Success Response:** 201 Created with window details
- **Overlap Error:** 409 Conflict with detailed error message

### Update Maintenance Window
- **Endpoint:** `PATCH /maintenance-windows/:id`
- **Success Response:** 200 OK with updated window details
- **Overlap Error:** 409 Conflict with detailed error message

## Error Response Format

When an overlap is detected, the response includes:
- Status Code: 409 CONFLICT
- Error message with details about conflicting windows

Example error message:
```
Cannot create maintenance window. The following maintenance windows have overlapping schedules:
- "Emergency Maintenance" (ID: 1) from 2025-07-10T10:00:00.000Z to 2025-07-10T12:00:00.000Z
```

## Testing Examples

### Test Case 1: Create Overlapping Window
```bash
# Create first window
curl -X POST http://localhost:5005/maintenance-windows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Window 1",
    "scheduleStart": "2025-07-10T10:00:00.000Z",
    "scheduleEnd": "2025-07-10T12:00:00.000Z",
    "status": "SCHEDULED",
    "type": "MINOR"
  }'

# Try to create overlapping window (should fail)
curl -X POST http://localhost:5005/maintenance-windows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Window 2 - Overlapping",
    "scheduleStart": "2025-07-10T11:00:00.000Z",
    "scheduleEnd": "2025-07-10T13:00:00.000Z",
    "status": "SCHEDULED",
    "type": "MINOR"
  }'
```

### Test Case 2: Update to Create Overlap
```bash
# Update existing window to overlap with another (should fail)
curl -X PATCH http://localhost:5005/maintenance-windows/2 \
  -H "Content-Type: application/json" \
  -d '{
    "scheduleStart": "2025-07-10T11:30:00.000Z",
    "scheduleEnd": "2025-07-10T13:30:00.000Z"
  }'
```

### Test Case 3: Create Non-overlapping Window
```bash
# Create non-overlapping window (should succeed)
curl -X POST http://localhost:5005/maintenance-windows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Window 3 - Non-overlapping",
    "scheduleStart": "2025-07-10T14:00:00.000Z",
    "scheduleEnd": "2025-07-10T16:00:00.000Z",
    "status": "SCHEDULED",
    "type": "MINOR"
  }'
```

## Implementation Details

### Service Layer
- `checkForOverlaps()`: Private method that queries database for overlapping windows
- Uses complex Prisma query with OR conditions to detect all overlap scenarios
- Returns list of conflicting windows with details

### Controller Layer
- Catches overlap validation errors from service
- Converts service errors to appropriate HTTP responses
- Returns 409 CONFLICT for overlaps, 404 NOT_FOUND for missing windows

### Database Query
The overlap detection uses a sophisticated Prisma query that checks for:
- Time range intersections using lte, gte, lt, gt operators
- Exclusion of current window during updates
- Selection of relevant window details for error messages

## Benefits

1. **Prevents Scheduling Conflicts**: Ensures maintenance windows don't overlap
2. **Clear Error Messages**: Provides detailed information about conflicts
3. **Consistent Validation**: Same logic applies to both create and update operations
4. **Database-Level Checking**: Ensures data integrity at the database level
5. **User-Friendly**: Clear error messages help users understand and resolve conflicts

## Future Enhancements

Potential improvements could include:
- Warning system for near-overlaps (e.g., windows starting/ending within 30 minutes)
- Automatic scheduling suggestions for alternative time slots
- Grace period configuration for minor overlaps
- Integration with calendar systems for visual overlap detection
