# Test Anomaly Criticality Filtering

## Prerequisites
- Server running on localhost:5005
- Valid authentication token (if required)

## Test Cases

### 1. Test Default Behavior (should return only criticality >= 9)
GET http://localhost:5005/anomaly?page=1&limit=10

### 2. Test All Anomalies (should return all regardless of criticality)
GET http://localhost:5005/anomaly?page=1&limit=10&criticality=all

### 3. Test Custom Criticality Threshold (should return criticality >= 7)
GET http://localhost:5005/anomaly?page=1&limit=10&criticality=7

### 4. Test Named Criticality Levels
GET http://localhost:5005/anomaly?page=1&limit=10&criticality=high
GET http://localhost:5005/anomaly?page=1&limit=10&criticality=medium
GET http://localhost:5005/anomaly?page=1&limit=10&criticality=critical

### 5. Test Search with Default Filtering
GET http://localhost:5005/anomaly/search?page=1&limit=10&q=test

### 6. Test Search with All Anomalies
GET http://localhost:5005/anomaly/search?page=1&limit=10&q=test&criticality=all

### 7. Test Dashboard with Default Filtering
GET http://localhost:5005/anomaly/DashBoard

### 8. Test Dashboard with All Anomalies
GET http://localhost:5005/anomaly/DashBoard?criticality=all

### 9. Test Maintenance Window with Default Filtering
GET http://localhost:5005/anomaly/eligible/24

### 10. Test Maintenance Window with All Anomalies
GET http://localhost:5005/anomaly/eligible/24?criticality=all

## Expected Results

### Default Behavior (criticality >= 9):
- Should only return anomalies with criticality field >= 9
- Response should contain fewer results compared to 'all' option

### All Anomalies (criticality=all):
- Should return all anomalies regardless of criticality level
- Should have more results than default behavior

### Custom Threshold (criticality=7):
- Should only return anomalies with criticality >= 7
- Results should be between default and 'all' in count

### Named Levels:
- critical: criticality > 9
- high: criticality between 7-9
- medium: criticality between 3-6

## How to Test

1. Use Swagger UI at http://localhost:5005/api
2. Use curl commands from terminal
3. Use Postman or similar API testing tool
4. Check the response data array and verify criticality values match expectations

## Sample Curl Commands

```bash
# Test default behavior
curl -X GET "http://localhost:5005/anomaly?page=1&limit=5" -H "Authorization: Bearer YOUR_TOKEN"

# Test all anomalies
curl -X GET "http://localhost:5005/anomaly?page=1&limit=5&criticality=all" -H "Authorization: Bearer YOUR_TOKEN"

# Test custom threshold
curl -X GET "http://localhost:5005/anomaly?page=1&limit=5&criticality=7" -H "Authorization: Bearer YOUR_TOKEN"
```
