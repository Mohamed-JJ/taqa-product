# REX Attachment Test URLs for Postman

## Base URL
```
http://localhost:5005
```

## REX Attachment Endpoints

### 1. Upload REX Attachment to Anomaly

#### Upload REX file for anomaly ID 1
```
POST http://localhost:5005/attachements/1/rex-attachements
Content-Type: multipart/form-data

Body (form-data):
- Key: file
- Type: File
- Value: [Select a file - PDF, DOC, or image]
```

#### Upload REX file for anomaly ID 2
```
POST http://localhost:5005/attachements/2/rex-attachements
Content-Type: multipart/form-data

Body (form-data):
- Key: file
- Type: File
- Value: [Select a file]
```

#### Upload REX file for anomaly ID 3
```
POST http://localhost:5005/attachements/3/rex-attachements
Content-Type: multipart/form-data

Body (form-data):
- Key: file
- Type: File
- Value: [Select a file]
```

### 2. Test with Non-existent Anomaly (Should fail gracefully)

#### Upload REX file for non-existent anomaly ID 9999
```
POST http://localhost:5005/attachements/9999/rex-attachements
Content-Type: multipart/form-data

Body (form-data):
- Key: file
- Type: File
- Value: [Select a file]
```

### 3. Get Anomaly with REX File Path (After Upload)

#### Get anomaly ID 1 to verify REX file path is saved
```
GET http://localhost:5005/anomaly/1
```

#### Get anomaly ID 2 to verify REX file path is saved
```
GET http://localhost:5005/anomaly/2
```

### 4. List All Attachments

#### Get all attachments to verify REX attachment records
```
GET http://localhost:5005/attachements
```

### 5. Get Specific Attachment

#### Get attachment by ID (use ID returned from upload response)
```
GET http://localhost:5005/attachements/{attachment_id}
```

## Postman Setup Instructions

### 1. Create New Request for REX Upload
1. **Method**: POST
2. **URL**: `http://localhost:5005/attachements/1/rex-attachements`
3. **Headers**: 
   - Content-Type will be set automatically for multipart/form-data
4. **Body**: 
   - Select "form-data"
   - Add key: "file"
   - Change type to "File"
   - Click "Select Files" and choose a test file

### 2. Test File Types
Try uploading different file types:
- **PDF files**: REX reports, documentation
- **Word documents**: .doc, .docx
- **Images**: .jpg, .png (for screenshots)
- **Text files**: .txt
- **Excel files**: .xlsx (for data analysis)

### 3. Expected Response Structure

#### Successful Upload Response:
```json
{
  "message": "REX attachment saved and linked to anomaly successfully",
  "success": true,
  "data": {
    "attachmentId": 1,
    "fileName": "rex_2025-07-08T15-30-45-123Z_abc123.pdf",
    "filePath": "attachements/rex/rex_2025-07-08T15-30-45-123Z_abc123.pdf",
    "anomalyId": 1,
    "originalName": "my_rex_report.pdf",
    "size": 1024576,
    "mimeType": "application/pdf"
  }
}
```

#### Failed Upload Response (Anomaly Not Found):
```json
{
  "message": "Anomaly not found",
  "success": false,
  "error": "No anomaly found with ID 9999"
}
```

#### Failed Upload Response (File Error):
```json
{
  "message": "Failed to upload REX attachment",
  "success": false,
  "error": "Failed to save REX attachment file"
}
```

### 4. Verification Steps

After uploading a REX file:

1. **Check the response** contains all expected fields
2. **Verify file was saved** by checking the file system at the returned path
3. **Check anomaly record** was updated with `rexFilePath`
4. **Verify attachment record** was created in the database
5. **Test retrieval** of the attachment record

### 5. Test Scenarios

#### Valid Test Cases:
- ✅ Upload PDF file to existing anomaly
- ✅ Upload image file to existing anomaly  
- ✅ Upload Word document to existing anomaly
- ✅ Verify file is saved with unique name
- ✅ Verify anomaly rexFilePath is updated
- ✅ Verify attachment record is created

#### Error Test Cases:
- ❌ Upload to non-existent anomaly ID
- ❌ Upload without file
- ❌ Upload with invalid anomaly ID format
- ❌ Upload very large file (test size limits)

### 6. File Organization

The REX files will be organized as:
```
attachements/
└── rex/
    ├── rex_2025-07-08T15-30-45-123Z_abc123.pdf
    ├── rex_2025-07-08T15-31-12-456Z_def456.docx
    └── rex_2025-07-08T15-32-33-789Z_ghi789.jpg
```

Each file gets:
- Timestamp prefix
- UUID suffix
- Original file extension preserved
- Stored in dedicated rex subdirectory

## Integration with Anomaly Management

The REX attachment feature integrates with the anomaly system by:

1. **Validating anomaly existence** before allowing file upload
2. **Creating attachment record** linked to the specific anomaly
3. **Updating anomaly record** with the REX file path for easy access
4. **Generating unique filenames** to prevent conflicts
5. **Providing detailed response** with all relevant IDs and paths

This allows the frontend to:
- Show REX file status on anomaly details
- Download REX files directly
- Manage REX attachments per anomaly
- Track REX upload history
