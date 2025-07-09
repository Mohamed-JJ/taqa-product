# Dashboard Service Filter Implementation

## Overview
Enhanced the Dashboard endpoint to support filtering by service. The dashboard now returns metrics filtered by service when the `service` query parameter is provided, otherwise returns metrics for all anomalies.

## Implementation Details

### Endpoint
- **URL**: `GET /anomaly/DashBoard`
- **Method**: GET
- **Query Parameters**: 
  - `service` (optional): Filter dashboard metrics by service

### Code Changes

#### Added Service Query Parameter
```typescript
@Get('/DashBoard')
@ApiQuery({
  name: 'service',
  required: false,
  type: String,
  description: 'Filter dashboard metrics by service',
  example: '34MC',
})
@ApiResponse({
  status: 200,
  description: 'Dashboard metrics for anomalies',
  type: AnomalyDashboardResponse,
})
async dashboard(@Query('service') service?: string) {
```

#### Enhanced Data Fetching Logic
```typescript
// Fetch all anomalies or filter by service
const ret_1 = service
  ? await this.prismaService.anomaly.findMany({
      where: {
        service: service,
      },
    })
  : await this.prismaService.anomaly.findMany();
```

## Test Results

### All Services (No Filter)
```bash
curl -X GET "http://localhost:5005/anomaly/DashBoard"
```

**Response**:
- Total Anomalies: 9
- All metrics calculated from all anomalies

### Service Filter: 34MC
```bash
curl -X GET "http://localhost:5005/anomaly/DashBoard?service=34MC"
```

**Response**:
- Total Anomalies: 5
- All metrics calculated from anomalies with service="34MC"

### Service Filter: 34MD
```bash
curl -X GET "http://localhost:5005/anomaly/DashBoard?service=34MD"
```

**Response**:
- Total Anomalies: 4
- All metrics calculated from anomalies with service="34MD"

### Non-existent Service
```bash
curl -X GET "http://localhost:5005/anomaly/DashBoard?service=NonExistentService"
```

**Response**:
- Total Anomalies: 0
- All metrics show zero values

## Affected Dashboard Metrics

When a service filter is applied, all the following metrics are calculated based on the filtered dataset:

1. **Basic Counts**:
   - `totalAnomalies`
   - `openAnomalies` 
   - `criticalAnomalies`
   - `highPriorityAnomalies`

2. **Time-based Metrics**:
   - `averageResolutionTime`
   - `trendAnalysis` (thisMonth, lastMonth, percentageChange)

3. **Status Distribution**:
   - `anomaliesByStatus` (en-cours, traité, cloturé)

4. **Criticality Distribution**:
   - `anomaliesByCriticality` (low, medium, high)

5. **Equipment Distribution**:
   - `anomaliesByUnit` (breakdown by equipment)

6. **Safety and Availability Metrics**:
   - `safetyImpactMetrics`
   - `availabilityImpactMetrics`

7. **Maintenance Metrics**:
   - `maintenanceWindowUtilization`
   - `recentAnomalies` (filtered to service)

## API Documentation

### Query Parameters
- **service** (optional): 
  - Type: String
  - Description: Filter dashboard metrics by service
  - Example: `34MC`, `34MD`

### Examples

#### Get overall dashboard metrics
```http
GET /anomaly/DashBoard
```

#### Get dashboard metrics for specific service
```http
GET /anomaly/DashBoard?service=34MC
```

#### Test with different services
```bash
# All anomalies
curl -X GET "http://localhost:5005/anomaly/DashBoard"

# Filter by 34MC service
curl -X GET "http://localhost:5005/anomaly/DashBoard?service=34MC"

# Filter by 34MD service  
curl -X GET "http://localhost:5005/anomaly/DashBoard?service=34MD"

# Non-existent service (returns empty metrics)
curl -X GET "http://localhost:5005/anomaly/DashBoard?service=XYZ"
```

## Benefits

1. **Flexible Reporting**: Users can get dashboard metrics for specific services or all services
2. **Backward Compatibility**: Existing calls without service parameter continue to work
3. **Efficient Filtering**: Database-level filtering improves performance
4. **Consistent Metrics**: All dashboard metrics are consistently filtered by the same service

## Use Cases

- **Service-specific Dashboards**: Display metrics for a particular service team
- **Comparative Analysis**: Compare metrics across different services
- **Service Performance Monitoring**: Track KPIs for specific services
- **Multi-tenant Applications**: Isolate metrics by service/department

## Conclusion

The dashboard endpoint now supports optional service filtering while maintaining backward compatibility. All dashboard metrics are consistently filtered when a service parameter is provided, allowing for service-specific monitoring and reporting.
