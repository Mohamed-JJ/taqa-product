import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Res,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { AttachementsService } from './attachements.service';
import { Prisma } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { existsSync, mkdirSync } from 'node:fs';
import { Response } from 'express';
import { join } from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  CreateAttachementDto,
  AttachmentResponse,
  FileUploadResponse,
} from './dto/create-attachement.dto';
import { UpdateAttachementDto } from './dto/update-attachement.dto';
import { PassPortJwtGuard } from 'src/auth/guards/jwt.guard';
import { v4 as uuidv4 } from 'uuid';
@Controller('attachements')
@ApiTags('attachments')
@UseGuards(PassPortJwtGuard)
export class AttachementsController {
  constructor(private readonly attachementsService: AttachementsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new attachment',
    description: 'Creates a new attachment record in the database',
  })
  @ApiBody({
    type: CreateAttachementDto,
    description: 'Attachment data to create',
  })
  @ApiResponse({
    description: 'Attachment successfully created',
    type: AttachmentResponse,
  })
  create(@Body() createAttachementDto: Prisma.attachmentsCreateInput) {
    return this.attachementsService.create(createAttachementDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all attachments',
    description: 'Retrieves a list of all attachments in the system',
  })
  @ApiResponse({
    description: 'List of attachments retrieved successfully',
    type: [AttachmentResponse],
  })
  findAll() {
    return this.attachementsService.findAll();
  }
  @Get('/rex')
  @ApiOperation({
    summary: 'Get all REX attachments',
    description:
      'Retrieves all REX attachments from all anomalies in the system with pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all REX attachments retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              description: { type: 'string' },
              rexFilePath: { type: 'string' },
              fileName: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
            hasNext: { type: 'boolean' },
            hasPrev: { type: 'boolean' },
          },
        },
      },
    },
  })
  async getAllRexAttachments(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string
  ) {
    try {
      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;

      // Validate pagination parameters
      if (pageNumber < 1) {
        return {
          message: 'Page number must be greater than 0',
          success: false,
          error: 'Invalid page number',
        };
      }

      if (limitNumber < 1 || limitNumber > 100) {
        return {
          message: 'Limit must be between 1 and 100',
          success: false,
          error: 'Invalid limit value',
        };
      }

      const result = await this.attachementsService.findAllRexAttachments(
        pageNumber,
        limitNumber,
        search
      );

      // Transform the data to include fileName extracted from path
      const transformedData = result.data.map((anomaly) => ({
        id: anomaly.id,
        description: anomaly.description,
        rexFilePath: anomaly.rexFilePath,
        fileName: anomaly.rexFilePath
          ? anomaly.rexFilePath.split('/').pop()
          : null,
        createdAt: anomaly.createdAt,
        updatedAt: anomaly.updatedAt,
        anomaly: anomaly
      }));

      return {
        message: 'REX attachments retrieved successfully',
        success: true,
        data: transformedData,
        pagination: result.pagination,
      };
    } catch (error) {
      console.error('Error retrieving REX attachments:', error);
      return {
        message: 'Failed to retrieve REX attachments',
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
  @Get(':id')
  @ApiOperation({
    summary: 'Get attachment by ID',
    description: 'Retrieves a specific attachment by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the attachment to retrieve',
    example: 1,
  })
  @ApiResponse({
    description: 'Attachment retrieved successfully',
    type: AttachmentResponse,
  })
  findOne(@Param('id') id: string) {
    return this.attachementsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update attachment by ID',
    description: 'Updates an existing attachment with new data',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the attachment to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateAttachementDto,
    description: 'Attachment data to update',
  })
  @ApiResponse({
    description: 'Attachment updated successfully',
    type: AttachmentResponse,
  })
  update(
    @Param('id') id: string,
    @Body() updateAttachementDto: Prisma.attachmentsUpdateInput
  ) {
    return this.attachementsService.update(+id, updateAttachementDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete attachment by ID',
    description: 'Deletes an attachment from the system',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the attachment to delete',
    example: 1,
  })
  @ApiResponse({
    description: 'Attachment deleted successfully',
    type: AttachmentResponse,
  })
  remove(@Param('id') id: string) {
    return this.attachementsService.remove(+id);
  }

  @Post('/:id/rex-attachements')
  @ApiOperation({
    summary: 'Upload REX attachment file for an anomaly',
    description:
      'Uploads a REX (Return of Experience) file attachment and links it to a specific anomaly',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the anomaly to attach the REX file to',
    example: 1,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The REX file to upload',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'REX file uploaded and attached to anomaly successfully',
    type: FileUploadResponse,
  })
  @UseInterceptors(FileInterceptor('file'))
  async rex_attachements(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      const anomalyId = parseInt(id);
      // Validate that the anomaly exists
      const anomaly = await this.attachementsService.findAnomalyById(anomalyId);
      if (!anomaly) {
        return {
          message: 'Anomaly not found',
          success: false,
          error: `No anomaly found with ID ${anomalyId}`,
        };
      }

      // Ensure the rex directory exists
      if (!existsSync('attachements/rex')) {
        mkdirSync('attachements/rex', { recursive: true });
      }

      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const uniqueId = uuidv4();
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `rex_${timestamp}_${uniqueId}.${fileExtension}`;
      const filePath = `attachements/rex/${fileName}`;

      // Save file to local directory
      const fileSaved = this.attachementsService.save_to_local_dir(
        filePath,
        file.buffer
      );

      if (fileSaved) {
        // Create attachment record in database
        const attachment = await this.attachementsService.create({
          name: fileName,
          anomaly: {
            connect: { id: anomalyId },
          },
        });

        // Update anomaly with REX file path
        await this.attachementsService.updateAnomalyRexPath(
          anomalyId,
          filePath
        );

        return {
          message: 'REX attachment saved and linked to anomaly successfully',
          success: true,
          data: {
            attachmentId: attachment.id,
            fileName: fileName,
            filePath: filePath,
            anomalyId: anomalyId,
            originalName: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
          },
        };
      }

      throw new Error('Failed to save REX attachment file');
    } catch (error: unknown) {
      console.error('Error uploading REX attachment:', error);
      return {
        message: 'Failed to upload REX attachment',
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  @Post('/action-plan-attachements')
  @ApiOperation({
    summary: 'Upload action plan attachment file',
    description:
      'Uploads a file attachment and saves it to the local directory',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The file to upload',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: FileUploadResponse,
  })
  @UseInterceptors(FileInterceptor('file'))
  action_plan_attachements(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!existsSync('action_plan')) {
        mkdirSync('attachements');
      }
      const path = 'attachements/' + file.originalname + uuidv4();
      const ret = this.attachementsService.save_to_local_dir(path, file.buffer);
      if (ret)
        return {
          message: 'attachement saved successfully',
          success: true,
          data: { path: path },
        };
      throw new Error('error in saving attachement');
    } catch (error: unknown) {
      console.log('error', error);
    }
    return null;
  }

  @Get('/rex/:id')
  @ApiOperation({
    summary: 'Get REX attachment for an anomaly',
    description: 'Retrieves the REX attachment file for a specific anomaly',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the anomaly to retrieve the REX file for',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'REX attachment file',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Anomaly or REX file not found',
  })
  async getRexAttachment(@Param('id') id: string, @Res() response: Response) {
    try {
      const anomalyId = parseInt(id);

      // Find the anomaly by ID
      const anomaly = await this.attachementsService.findAnomalyById(anomalyId);
      if (!anomaly) {
        throw new NotFoundException(`Anomaly with ID ${anomalyId} not found`);
      }

      // Get the REX file path from the anomaly record
      const rexFilePath = anomaly.rexFilePath;
      if (!rexFilePath) {
        throw new NotFoundException(
          `REX file not found for anomaly ID ${anomalyId}`
        );
      }

      // Construct the full file path
      const filePath = join(process.cwd(), rexFilePath);

      // Check if the file exists
      if (!existsSync(filePath)) {
        throw new NotFoundException(`REX file not found at path: ${filePath}`);
      }

      // Get the original filename from the path
      const fileName = rexFilePath.split('/').pop() || 'rex-file';

      // Set appropriate headers
      response.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`
      );
      response.setHeader('Content-Type', 'application/octet-stream');

      // Stream the file to the response
      return response.sendFile(filePath);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error retrieving REX file:', error);
      throw new NotFoundException('Failed to retrieve REX file');
    }
  }
}
