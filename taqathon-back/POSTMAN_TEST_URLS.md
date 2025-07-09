# Postman Test URLs for Advanced Anomaly Filtering

## Base URL
```
http://localhost:5005
```

## REX File Management Endpoints

### REX File Upload
```
POST http://localhost:5005/attachements/1/rex-attachements
Content-Type: multipart/form-data
Body: file (binary)
```

### REX File Retrieval (Browser Compatible)
```
GET http://localhost:5005/attachements/rex/1
```

**Description**: Retrieves the REX file for anomaly ID 1. Can be accessed directly in browser for automatic download.

**Response**: 
- Success (200): File download with proper headers
- Error (404): Anomaly not found or no REX file exists

**Test Cases**:
- Valid anomaly with REX file: `GET http://localhost:5005/attachements/rex/1`
- Non-existent anomaly: `GET http://localhost:5005/attachements/rex/999`
- Anomaly without REX file: `GET http://localhost:5005/attachements/rex/2`

## Dashboard Endpoints

### Dashboard Metrics (All Services)
```
GET http://localhost:5005/anomaly/DashBoard
```

### Dashboard Metrics (Filtered by Service)
```
GET http://localhost:5005/anomaly/DashBoard?service=34MC
GET http://localhost:5005/anomaly/DashBoard?service=34MD
```

**Description**: Returns dashboard metrics for anomalies. Can be filtered by service parameter.

**Query Parameters**:
- `service` (optional): Filter metrics by service name

**Test Cases**:
- All services: `GET http://localhost:5005/anomaly/DashBoard`
- Service 34MC: `GET http://localhost:5005/anomaly/DashBoard?service=34MC`
- Service 34MD: `GET http://localhost:5005/anomaly/DashBoard?service=34MD`
- Non-existent service: `GET http://localhost:5005/anomaly/DashBoard?service=XYZ`

## Test Collection for Anomaly Search Endpoint

### 1. Basic Endpoints (No Filters)

#### Get All Anomalies (Basic Pagination)
```
GET http://localhost:5005/anomaly/search
GET http://localhost:5005/anomaly/search?page=1&limit=10
```

### 2. Text Search (q parameter)

#### Search for "vibration"
```
GET http://localhost:5005/anomaly/search?q=vibration
GET http://localhost:5005/anomaly/search?q=vibration&page=1&limit=5
```

#### Search for "fuite" (leak)
```
GET http://localhost:5005/anomaly/search?q=fuite
GET http://localhost:5005/anomaly/search?q=fuite&page=1&limit=3
```

#### Search for "ramoneur"
```
GET http://localhost:5005/anomaly/search?q=ramoneur
```

#### Search for "vapeur" (vapor)
```
GET http://localhost:5005/anomaly/search?q=vapeur
```

### 3. Description Filter

#### Filter by description containing "vibration"
```
GET http://localhost:5005/anomaly/search?description=vibration
```

#### Filter by description containing "fuite"
```
GET http://localhost:5005/anomaly/search?description=fuite
```

#### Filter by description containing "débouchage"
```
GET http://localhost:5005/anomaly/search?description=débouchage
```

### 4. Equipment Filter

#### Filter by specific equipment IDs (from actual data)
```
GET http://localhost:5005/anomaly/search?equipment=64927d6a-f0ff-42fe-a137-fb5a78219e91
GET http://localhost:5005/anomaly/search?equipment=dcd4635e-ec4c-43ec-90f2-3ff21755c46a
GET http://localhost:5005/anomaly/search?equipment=0c376ae3-65f4-4dca-8bee-88b621145a1d
```

#### Partial equipment search
```
GET http://localhost:5005/anomaly/search?equipment=64927d6a
GET http://localhost:5005/anomaly/search?equipment=dcd4635e
```

### 5. Detection Date Filter

#### Filter by specific dates (from actual data)
```
GET http://localhost:5005/anomaly/search?detectionDate=2019-01-01
GET http://localhost:5005/anomaly/search?detectionDate=2019-01-02
GET http://localhost:5005/anomaly/search?detectionDate=2019-01-03
```

#### Test with pagination
```
GET http://localhost:5005/anomaly/search?detectionDate=2019-01-03&page=1&limit=3
```

### 6. System Filter

#### Filter by system IDs (from actual data)
```
GET http://localhost:5005/anomaly/search?system=a738c0f1-e548-4680-9409-ef6832ec1e32
GET http://localhost:5005/anomaly/search?system=8ab799f5-144f-420c-b426-3d7e36b13f59
GET http://localhost:5005/anomaly/search?system=f771d801-5357-4818-976c-6a8102b713e2
```

#### Partial system search
```
GET http://localhost:5005/anomaly/search?system=a738c0f1
GET http://localhost:5005/anomaly/search?system=8ab799f5
```

### 7. Service Filter

#### Filter by service departments (from actual data)
```
GET http://localhost:5005/anomaly/search?service=34MC
GET http://localhost:5005/anomaly/search?service=34MD
```

#### Test with pagination
```
GET http://localhost:5005/anomaly/search?service=34MC&page=1&limit=5
GET http://localhost:5005/anomaly/search?service=34MD&page=1&limit=5
```

### 8. System Shutdown Required Filter

#### Filter by shutdown requirement
```
GET http://localhost:5005/anomaly/search?sysShutDownRequired=true
GET http://localhost:5005/anomaly/search?sysShutDownRequired=false
```

#### With pagination
```
GET http://localhost:5005/anomaly/search?sysShutDownRequired=false&page=1&limit=5
GET http://localhost:5005/anomaly/search?sysShutDownRequired=true&page=1&limit=5
```

### 9. Combined Filters

#### Text search + Service filter
```
GET http://localhost:5005/anomaly/search?q=fuite&service=34MC
GET http://localhost:5005/anomaly/search?q=vibration&service=34MC
```

#### Date + Service filter
```
GET http://localhost:5005/anomaly/search?detectionDate=2019-01-03&service=34MD
GET http://localhost:5005/anomaly/search?detectionDate=2019-01-01&service=34MC
```

#### Multiple filters combination
```
GET http://localhost:5005/anomaly/search?q=ramoneur&service=34MC&sysShutDownRequired=false
GET http://localhost:5005/anomaly/search?description=fuite&service=34MD&detectionDate=2019-01-03
```

#### Complex combination with pagination
```
GET http://localhost:5005/anomaly/search?q=vapeur&service=34MC&sysShutDownRequired=false&page=1&limit=3
GET http://localhost:5005/anomaly/search?system=8ab799f5&service=34MC&detectionDate=2019-01-03&page=1&limit=2
```

### 10. Edge Cases and Validation Tests

#### Empty/Non-existent data
```
GET http://localhost:5005/anomaly/search?q=nonexistent
GET http://localhost:5005/anomaly/search?service=INVALID
GET http://localhost:5005/anomaly/search?detectionDate=2025-01-01
```

#### Special characters and encoding
```
GET http://localhost:5005/anomaly/search?description=étanche
GET http://localhost:5005/anomaly/search?q=trop plein
```

#### Large page numbers
```
GET http://localhost:5005/anomaly/search?page=100&limit=5
GET http://localhost:5005/anomaly/search?service=34MC&page=10&limit=1
```

#### Different limit sizes
```
GET http://localhost:5005/anomaly/search?limit=1
GET http://localhost:5005/anomaly/search?limit=50
GET http://localhost:5005/anomaly/search?limit=100
```

### 11. Performance Tests

#### All filters active
```
GET http://localhost:5005/anomaly/search?q=fuite&description=fuite&equipment=e12bf97e&detectionDate=2019-01-03&system=8ab799f5&service=34MD&sysShutDownRequired=false&page=1&limit=10
```

### 12. Comparison Tests (Before/After Implementation)

#### Test original search functionality still works
```
GET http://localhost:5005/anomaly/search?q=pump&page=1&limit=10
```

## Expected Response Format

All endpoints should return responses in this format:
```json
{
  "data": [...],
  "total": 9,
  "page": 1,
  "limit": 10,
  "totalPages": 1,
  "hasNext": false,
  "hasPrev": false
}
```

## Postman Collection Import

You can create a Postman collection by:
1. Create a new collection named "Anomaly Advanced Filtering"
2. Set the base URL variable to `http://localhost:5005`
3. Add each URL above as a separate request
4. Organize into folders by filter type

## Verification Points

For each test, verify:
- ✅ Status code is 200
- ✅ Response has correct pagination structure
- ✅ `data` array contains expected anomalies
- ✅ `total` count matches expected results
- ✅ Pagination info (`page`, `limit`, `totalPages`, `hasNext`, `hasPrev`) is correct
- ✅ Filtered results actually match the filter criteria

## Performance Benchmarks

Monitor response times for:
- Simple filters: < 100ms
- Combined filters: < 200ms
- Complex queries with pagination: < 300ms
