# Anomaly Maintenance Window Auto-Removal Feature

## Overview
The anomaly update system now includes automatic removal of anomalies from maintenance windows when they no longer require system shutdown. This ensures that maintenance windows only contain anomalies that actually need the system to be shut down.

## Feature Description

### Automatic Removal Logic
When updating an anomaly via the PATCH `/anomaly/:id` endpoint, if the `sysShutDownRequired` field is set to `false`, the system will automatically:

1. **Check Current State**: Verify if the anomaly is currently assigned to a maintenance window
2. **Remove from Window**: If assigned, remove the anomaly from the maintenance window
3. **Update Flags**: Set appropriate flags to prevent automatic reassignment
4. **Log Action**: Log the removal action for audit purposes

### Implementation Details

#### Service Layer Logic
```typescript
// Check if sysShutDownRequired is being set to false
const isSettingShutDownToFalse = updateAnomalyDto.sysShutDownRequired === false;

// If anomaly is being set to not require shutdown and it's currently assigned to a maintenance window
if (isSettingShutDownToFalse && currentAnomaly.maintenanceWindowId) {
  // Remove the anomaly from the maintenance window by disconnecting it
  updateAnomalyDto.maintenanceWindow = { disconnect: true };
  updateAnomalyDto.forcedAssigned = true; // Mark as forced assigned to prevent auto-reassignment
  
  console.log(`Removing anomaly ${id} from maintenance window ${currentAnomaly.maintenanceWindowId} due to sysShutDownRequired = false`);
}
```

#### Database Changes
When an anomaly is removed from a maintenance window:
- `maintenanceWindowId` is set to `null`
- `forcedAssigned` is set to `true` to prevent automatic reassignment
- `sysShutDownRequired` is set to `false`

## API Usage

### Endpoint
- **Method**: PATCH
- **URL**: `/anomaly/:id`
- **Authentication**: Bearer token required

### Request Body
```json
{
  "sysShutDownRequired": false
}
```

### Response
The updated anomaly object with:
- `sysShutDownRequired`: `false`
- `maintenanceWindowId`: `null` (if was previously assigned)
- `forcedAssigned`: `true` (if was previously assigned)

## Usage Examples

### Example 1: Remove Anomaly from Maintenance Window
```bash
# Update anomaly to not require shutdown (will remove from maintenance window)
curl -X PATCH http://localhost:5005/anomaly/10 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "sysShutDownRequired": false
  }'
```

**Response** (if anomaly was in maintenance window):
```json
{
  "id": 10,
  "description": "Test anomaly for maintenance window removal",
  "equipment": "TEST-001",
  "sysShutDownRequired": false,
  "maintenanceWindowId": null,
  "forcedAssigned": true,
  "updatedAt": "2025-07-09T01:39:52.793Z"
}
```

### Example 2: Update Anomaly Not in Maintenance Window
```bash
# Update anomaly to not require shutdown (no maintenance window impact)
curl -X PATCH http://localhost:5005/anomaly/11 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "sysShutDownRequired": false
  }'
```

**Response** (if anomaly was not in maintenance window):
```json
{
  "id": 11,
  "description": "Test anomaly NOT in maintenance window",
  "equipment": "TEST-002",
  "sysShutDownRequired": false,
  "maintenanceWindowId": null,
  "forcedAssigned": true,
  "updatedAt": "2025-07-09T01:41:44.156Z"
}
```

## Testing Scenarios

### Test Case 1: Anomaly in Maintenance Window
1. Create an anomaly with `sysShutDownRequired: true`
2. Assign it to a maintenance window
3. Update the anomaly to set `sysShutDownRequired: false`
4. **Expected**: Anomaly is removed from maintenance window

### Test Case 2: Anomaly Not in Maintenance Window
1. Create an anomaly with `sysShutDownRequired: true`
2. Do not assign it to any maintenance window
3. Update the anomaly to set `sysShutDownRequired: false`
4. **Expected**: Anomaly is updated without errors

### Test Case 3: Other Field Updates
1. Create an anomaly in a maintenance window
2. Update other fields (description, equipment, etc.) without changing `sysShutDownRequired`
3. **Expected**: Anomaly remains in maintenance window

## Benefits

1. **Automated Cleanup**: Automatically removes anomalies that no longer need system shutdown
2. **Data Integrity**: Ensures maintenance windows only contain relevant anomalies
3. **Audit Trail**: Logs all removal actions for tracking
4. **Prevents Reassignment**: Sets flags to prevent automatic reassignment of removed anomalies
5. **Seamless Integration**: Works transparently with existing update operations

## System Behavior

### When `sysShutDownRequired` is set to `false`:
- ✅ Anomaly is removed from maintenance window (if assigned)
- ✅ `forcedAssigned` flag is set to `true`
- ✅ Action is logged to console
- ✅ Maintenance window optimization is triggered

### When `sysShutDownRequired` is set to `true`:
- ✅ Normal update behavior (no automatic removal)
- ✅ Anomaly may be eligible for automatic assignment to maintenance windows

### When other fields are updated:
- ✅ Normal update behavior
- ✅ No impact on maintenance window assignment

## Error Handling

The system includes proper error handling for:
- **Not Found**: If anomaly doesn't exist
- **Invalid Input**: If update data is malformed
- **Database Errors**: If update operation fails

## Logging

All removal actions are logged with the format:
```
Removing anomaly {id} from maintenance window {maintenanceWindowId} due to sysShutDownRequired = false
```

## Future Enhancements

Potential improvements could include:
- Notification system for maintenance window managers
- Batch update operations for multiple anomalies
- Historical tracking of maintenance window assignments
- Integration with change management systems
