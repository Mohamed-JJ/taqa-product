# Anomaly Pagination Float Values Ceiling Implementation

## Overview
This document describes the implementation of ceiling functionality for float values in the anomaly pagination and search endpoints.

## Float Fields Affected
The following float fields are now ceiled (rounded up to the nearest integer) in the API responses:
- `criticality` (Float?)
- `predictedDisponibility` (Float?)
- `predictedIntegrity` (Float?)
- `integrity` (Float?)

## Endpoints Modified
1. **GET /anomaly** (pagination endpoint)
   - Method: `findAllPagination`
   - Applies ceiling to all float fields in the returned data

2. **GET /anomaly/search** (search pagination endpoint)
   - Method: `findAllSearchPagination`
   - Applies ceiling to all float fields in the returned data

## Implementation Details

### Code Changes
The ceiling functionality was implemented in the `AnomalyService` class:

```typescript
// Ceil the float values in the anomalies data
const ceiledAnomalies = anomalies.map((anomaly) => ({
  ...anomaly,
  criticality:
    anomaly.criticality !== null ? Math.ceil(anomaly.criticality) : null,
  predictedDisponibility:
    anomaly.predictedDisponibility !== null
      ? Math.ceil(anomaly.predictedDisponibility)
      : null,
  predictedIntegrity:
    anomaly.predictedIntegrity !== null
      ? Math.ceil(anomaly.predictedIntegrity)
      : null,
  integrity:
    anomaly.integrity !== null ? Math.ceil(anomaly.integrity) : null,
}));
```

### Null Handling
The implementation properly handles null values by checking if the field is not null before applying `Math.ceil()`.

### Example Results
**Database values:**
- `criticality: 2.979060351848602`
- `predictedDisponibility: 1.050116539001465`
- `predictedIntegrity: 1.007538557052612`
- `integrity: 1.0`

**API response (after ceiling):**
- `criticality: 3`
- `predictedDisponibility: 2`
- `predictedIntegrity: 2`
- `integrity: 1`

## Testing
Both endpoints have been tested and confirmed to work correctly:
- GET /anomaly?page=1&limit=50
- GET /anomaly/search?page=1&limit=50

The ceiling functionality is applied to all returned anomaly records in the pagination responses.

## Notes
- The ceiling function is NOT applied to individual anomaly fetches (GET /anomaly/:id)
- Only the pagination endpoints apply the ceiling transformation
- The database values remain unchanged; only the API response is modified
