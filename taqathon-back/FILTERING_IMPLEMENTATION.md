# Advanced Filtering Implementation for Anomaly Search

## Summary

Successfully implemented advanced filtering in the `/anomaly/search` endpoint, replacing the old criticality filter with comprehensive field-based filtering.

## New Filter Parameters

The search endpoint now supports the following filter parameters:

### 1. Text Search (q)
- **Parameter**: `q`
- **Type**: `string`
- **Description**: Searches across multiple fields: description, equipementDescription, equipment, service, system
- **Example**: `/anomaly/search?q=pump`

### 2. Description Filter
- **Parameter**: `description`
- **Type**: `string`
- **Description**: Filters by anomaly description (partial match)
- **Example**: `/anomaly/search?description=valve`

### 3. Equipment Filter
- **Parameter**: `equipment`
- **Type**: `string`
- **Description**: Filters by equipment identifier (partial match)
- **Example**: `/anomaly/search?equipment=pump-01`

### 4. Detection Date Filter
- **Parameter**: `detectionDate`
- **Type**: `string` (YYYY-MM-DD format)
- **Description**: Filters by detection date (exact day match)
- **Example**: `/anomaly/search?detectionDate=2019-01-03`

### 5. System Filter
- **Parameter**: `system`
- **Type**: `string`
- **Description**: Filters by system (partial match)
- **Example**: `/anomaly/search?system=heating`

### 6. Service Filter
- **Parameter**: `service`
- **Type**: `string`
- **Description**: Filters by service/department (partial match)
- **Example**: `/anomaly/search?service=34MC`

### 7. System Shutdown Required Filter
- **Parameter**: `sysShutDownRequired`
- **Type**: `boolean`
- **Description**: Filters by whether system shutdown is required
- **Example**: `/anomaly/search?sysShutDownRequired=true`

## Combined Filtering

All filters can be combined for more precise results:
```
/anomaly/search?q=fuite&service=34MC&sysShutDownRequired=false&page=1&limit=10
```

## Implementation Details

### Files Modified

1. **DTO**: `/src/anomaly/dto/pagination.dto.ts`
   - Updated `SearchPaginationDto` to include new filter properties
   - Removed `criticalityFilter` property
   - Added proper validation decorators

2. **Controller**: `/src/anomaly/anomaly.controller.ts`
   - Updated `/search` route to accept new filter parameters
   - Added Swagger documentation for new filters
   - Removed criticality filter handling

3. **Service**: `/src/anomaly/anomaly.service.ts`
   - Updated `findAllSearchPagination` method to handle new filters
   - Implemented proper Prisma query building
   - Added boolean conversion for query parameters
   - Removed criticality filter logic

### Key Features

- **Database-level filtering**: All filtering is performed at the database level using Prisma for optimal performance
- **Partial matching**: Text fields use `contains` for flexible searching
- **Date range support**: Detection date filter matches the entire day
- **Boolean handling**: Proper conversion of string query parameters to boolean values
- **Pagination**: All filtering works seamlessly with pagination
- **Validation**: Input validation using class-validator decorators

### Testing

- Created comprehensive test suite (`test-advanced-filtering.js`)
- Verified all filter parameters work correctly
- Tested combined filtering scenarios
- Confirmed pagination works with filters

## API Examples

### Basic search
```bash
GET /anomaly/search?q=vibration&page=1&limit=5
```

### Filter by service
```bash
GET /anomaly/search?service=34MC&page=1&limit=10
```

### Filter by date
```bash
GET /anomaly/search?detectionDate=2019-01-03&page=1&limit=5
```

### Combined filters
```bash
GET /anomaly/search?q=fuite&service=34MC&sysShutDownRequired=false&page=1&limit=10
```

## Migration Notes

- **Removed**: `criticalityFilter` parameter and associated logic
- **Added**: Six new filter parameters with comprehensive validation
- **Backward Compatible**: Basic pagination and search (`q`) parameter remain unchanged
- **Performance**: All filtering uses database-level operations for optimal performance

The implementation provides a more flexible and powerful filtering system that allows users to search and filter anomalies by multiple criteria simultaneously.
