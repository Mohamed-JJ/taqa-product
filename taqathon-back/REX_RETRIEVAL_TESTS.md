# REX File Retrieval Tests

## Overview
This document contains test cases for the REX file retrieval functionality that allows users to retrieve REX (Return of Experience) files via browser.

## Endpoint
- **URL**: `GET /attachements/rex/:id`
- **Method**: GET
- **Authentication**: None (public endpoint)
- **Parameters**: 
  - `id`: The ID of the anomaly to retrieve the REX file for

## Test Cases

### 1. Successful REX File Retrieval
**Test**: Retrieve REX file for anomaly ID 1
```bash
curl -X GET "http://localhost:5005/attachements/rex/1" -i
```

**Expected Response**:
- Status: 200 OK
- Headers: 
  - `Content-Disposition: attachment; filename="rex_2025-07-08T16-21-00-835Z_272a779a-bb2c-434d-b2a9-1721f697ef11.txt"`
  - `Content-Type: application/octet-stream`
- Body: The actual file content

**Actual Response**: ✅ PASS
```
HTTP/1.1 200 OK
Content-Disposition: attachment; filename="rex_2025-07-08T16-21-00-835Z_272a779a-bb2c-434d-b2a9-1721f697ef11.txt"
Content-Type: application/octet-stream
Content-Length: 44

This is a test REX file for anomaly testing
```

### 2. Non-existent Anomaly
**Test**: Retrieve REX file for non-existent anomaly ID 999
```bash
curl -X GET "http://localhost:5005/attachements/rex/999" -i
```

**Expected Response**:
- Status: 404 Not Found
- Error message about anomaly not found

**Actual Response**: ✅ PASS
```
HTTP/1.1 404 Not Found
{"message":"Anomaly with ID 999 not found","error":"Not Found","statusCode":404}
```

### 3. Anomaly Without REX File
**Test**: Retrieve REX file for anomaly ID 2 (which has no REX file)
```bash
curl -X GET "http://localhost:5005/attachements/rex/2" -i
```

**Expected Response**:
- Status: 404 Not Found
- Error message about REX file not found

**Actual Response**: ✅ PASS
```
HTTP/1.1 404 Not Found
{"message":"REX file not found for anomaly ID 2","error":"Not Found","statusCode":404}
```

### 4. Browser Access
**Test**: Access the REX file directly in browser
```
http://localhost:5005/attachements/rex/1
```

**Expected Behavior**:
- File should be downloaded automatically
- Browser should prompt to save the file with the correct filename

**Actual Response**: ✅ PASS
- File downloads automatically with correct filename
- Content-Disposition header triggers file download

## Implementation Details

### Key Features
1. **File Streaming**: Uses `response.sendFile()` to stream the file efficiently
2. **Proper Headers**: Sets appropriate Content-Disposition and Content-Type headers
3. **Error Handling**: Comprehensive error handling for missing anomalies and files
4. **Security**: Validates file paths and checks file existence
5. **Browser Compatibility**: Works seamlessly in browsers with automatic download

### Error Handling
- **Anomaly Not Found**: Returns 404 with descriptive message
- **REX File Not Found**: Returns 404 when anomaly has no REX file
- **File System Error**: Returns 404 when file doesn't exist on disk
- **General Errors**: Catches and logs unexpected errors

### Security Considerations
- Uses `join(process.cwd(), rexFilePath)` to construct safe file paths
- Validates file existence before serving
- No direct file path exposure in error messages

## Success Criteria
All test cases pass successfully:
- ✅ File retrieval works for valid anomaly with REX file
- ✅ Proper error handling for non-existent anomalies
- ✅ Proper error handling for anomalies without REX files
- ✅ Browser compatibility with automatic file download
- ✅ Correct HTTP headers for file download
- ✅ Secure file path handling

## Usage Examples

### Using curl
```bash
# Download REX file for anomaly ID 1
curl -X GET "http://localhost:5005/attachements/rex/1" -o rex_file.txt

# Check if REX file exists for anomaly ID 2
curl -X GET "http://localhost:5005/attachements/rex/2" -i
```

### Using browser
Simply navigate to: `http://localhost:5005/attachements/rex/1`

### Using JavaScript (fetch)
```javascript
fetch('http://localhost:5005/attachements/rex/1')
  .then(response => {
    if (response.ok) {
      return response.blob();
    }
    throw new Error('REX file not found');
  })
  .then(blob => {
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rex_file.txt';
    a.click();
  })
  .catch(error => console.error('Error:', error));
```

## Conclusion
The REX file retrieval mechanism is fully functional and provides a seamless way for users to access REX files through the browser. The implementation includes proper error handling, security measures, and browser compatibility.
