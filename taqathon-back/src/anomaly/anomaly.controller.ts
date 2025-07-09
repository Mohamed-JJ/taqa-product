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
  ParseFloatPipe,
  Query,
  BadRequestException,
  NotFoundException,
  UploadedFiles,
  Res,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { AnomalyService } from './anomaly.service';
import { Prisma } from '@prisma/client';
// import { PrismaClient, Anomaly } from '../../generated/prisma/client/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { MaintenanceWindowsService } from 'src/maintenance-windows/maintenance-windows.service';
import axios from 'axios';
import * as fs from 'fs';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import {
  Anomaly,
  AnomalyDashboardResponse,
  CreateAnomalyDto,
} from './dto/create-anomaly.dto';
import { UpdateAnomalyDto } from './dto/update-anomaly.dto';
import {
  PaginationDto,
  PaginatedResponse,
  SearchPaginationDto,
} from './dto/pagination.dto';
import { Response } from 'express';
import { join, parse } from 'path';
import { PassPortJwtGuard } from 'src/auth/guards/jwt.guard';

// Interface for external anomaly data structure
interface ExternalAnomalyData {
  original_data: {
    description?: string;
    description_de_lequipement?: string;
    systeme?: string;
    date_de_detection_de_lanomalie?: string;
    section_proprietaire?: string;
    num_equipement?: string;
    fiabilite_integrite?: number;
    disponibilte?: number;
    process_safety?: number;
    criticite?: number;
  };
  predictions: {
    'Fiabilité Intégrité'?: number;
    Disponibilité?: number;
    'Process Safety'?: number;
    Criticité?: number;
  };
}

interface ExternalApiResponse {
  results: ExternalAnomalyData[];
}

@Controller('anomaly')
@ApiTags('anomaly')
@UseGuards(PassPortJwtGuard)
export class AnomalyController {
  constructor(
    private readonly anomalyService: AnomalyService,
    private readonly prismaService: PrismaService,
    private readonly maintainanceWindowService: MaintenanceWindowsService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create anomaly' })
  @ApiBody({ type: CreateAnomalyDto })
  @ApiResponse({
    status: 200,
    type: Anomaly, // for a list
    description: 'List of anomalies',
  })
  async create(@Body() createAnomalyObj: Prisma.AnomalyCreateInput) {
    try {
      const anomaly = await this.anomalyService.create(createAnomalyObj);
      return anomaly;
    } catch (error) {
      console.error('Error creating anomaly:', error);
      throw new InternalServerErrorException('Failed to create anomaly');
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get all anomalies with pagination',
    description: 'Retrieves a paginated list of all anomalies',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-based)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (max 100)',
    example: 10,
  })
  @ApiQuery({
    name: 'criticality',
    required: false,
    type: String,
    description:
      'Filter by criticality level. Use "all" to see all anomalies, "default" for highest criticality only (>=9), or specify a custom threshold',
    example: 'default',
    enum: ['critical', 'high', 'medium', 'all', 'default'],
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of anomalies',
    type: PaginatedResponse<Anomaly>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid pagination parameters',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const { page = 1, limit = 10, criticality = 'default' } = paginationDto;
      return await this.anomalyService.findAllPagination(
        page,
        limit,
        criticality
      );
    } catch (error) {
      console.error('Error fetching anomalies:', error);
      throw new InternalServerErrorException('Failed to fetch anomalies');
    }
  }

  @Get('/search')
  @ApiOperation({
    summary: 'Search and filter anomalies with pagination',
    description:
      'Retrieves a paginated list of anomalies filtered by search query and/or criticality level',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-based)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (max 100)',
    example: 10,
  })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Search query for filtering anomalies',
    example: 'pump failure',
  })
  @ApiQuery({
    name: 'description',
    required: false,
    type: String,
    description: 'Filter by description',
    example: 'valve malfunction',
  })
  @ApiQuery({
    name: 'equipment',
    required: false,
    type: String,
    description: 'Filter by equipment',
    example: 'pump-01',
  })
  @ApiQuery({
    name: 'detectionDate',
    required: false,
    type: String,
    description: 'Filter by detection date (YYYY-MM-DD)',
    example: '2024-01-15',
  })
  @ApiQuery({
    name: 'system',
    required: false,
    type: String,
    description: 'Filter by system',
    example: 'heating-system',
  })
  @ApiQuery({
    name: 'service',
    required: false,
    type: String,
    description: 'Filter by service',
    example: 'maintenance',
  })
  @ApiQuery({
    name: 'sysShutDownRequired',
    required: false,
    type: Boolean,
    description: 'Filter by system shutdown requirement',
    example: true,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by anomaly status',
    example: 'IN_PROGRESS',
    enum: ['IN_PROGRESS', 'TREATED', 'CLOSED'],
  })
  @ApiQuery({
    name: 'criticality',
    required: false,
    type: String,
    description: 'Filter by criticality level',
    example: 'critical',
    enum: ['critical', 'high', 'medium'],
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    description: 'Sort order for criticality (ascending or descending)',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of anomalies',
    type: PaginatedResponse<Anomaly>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid pagination parameters',
  })
  findAllSearch(@Query() searchPaginationDto: SearchPaginationDto) {
    const {
      page = 1,
      limit = 10,
      q = null,
      description = null,
      equipment = null,
      detectionDate = null,
      system = null,
      service = null,
      sysShutDownRequired = null,
      status = null,
      criticality = null,
      sortOrder = 'desc',
    } = searchPaginationDto;
    return this.anomalyService.findAllSearchPagination(
      page,
      limit,
      q,
      description,
      equipment,
      detectionDate,
      system,
      service,
      sysShutDownRequired,
      status,
      criticality,
      sortOrder
    );
  }

  @Get('eligible/:time')
  @ApiQuery({
    name: 'criticality',
    required: false,
    type: String,
    description:
      'Filter by criticality level. Use "all" to see all anomalies, "default" for highest criticality only (>=9)',
    example: 'default',
    enum: ['critical', 'high', 'medium', 'all', 'default'],
  })
  async findAllForMaintenanceWindow(
    @Param('time', ParseFloatPipe) time: number,
    @Query('criticality') criticality?: string
  ) {
    try {
      return await this.anomalyService.findAllForMaintenanceWindow(
        time,
        criticality || 'default'
      );
    } catch (error) {
      console.error('Error fetching anomalies for maintenance window:', error);
      throw new InternalServerErrorException(
        'Failed to fetch anomalies for maintenance window'
      );
    }
  }

  @Get('/count')
  async anomaly_count() {
    try {
      return await this.prismaService.anomaly.count();
    } catch (error) {
      console.error('Error counting anomalies:', error);
      throw new InternalServerErrorException('Failed to count anomalies');
    }
  }

  @Get('/DashBoard')
  @ApiQuery({
    name: 'service',
    required: false,
    type: String,
    description: 'Filter dashboard metrics by service',
    example: '34MC',
  })
  @ApiQuery({
    name: 'month',
    required: false,
    type: Number,
    description: 'Filter dashboard metrics by month (1-12)',
    example: 7,
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: 'Filter dashboard metrics by year',
    example: 2025,
  })
  @ApiQuery({
    name: 'criticality',
    required: false,
    type: String,
    description:
      'Filter by criticality level. Use "all" to see all anomalies, "default" for highest criticality only (>=9)',
    example: 'default',
    enum: ['critical', 'high', 'medium', 'all', 'default'],
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard metrics for anomalies',
    type: AnomalyDashboardResponse,
  })
  async dashboard(
    @Query('service') service?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('criticality') criticality?: string
  ) {
    const ret_obj = {};
    try {
      // Parse month and year parameters
      const monthNumber = month ? parseInt(month, 10) : undefined;
      const yearNumber = year ? parseInt(year, 10) : undefined;

      // Validate month parameter
      if (monthNumber !== undefined && (monthNumber < 1 || monthNumber > 12)) {
        throw new BadRequestException('Month must be between 1 and 12');
      }

      // Validate year parameter
      if (
        yearNumber !== undefined &&
        (yearNumber < 1900 || yearNumber > 2100)
      ) {
        throw new BadRequestException('Year must be between 1900 and 2100');
      }

      // Fetch filtered anomalies
      const ret_1 = await this.anomalyService.findAllByServiceAndMonth(
        service,
        monthNumber,
        yearNumber,
        criticality || 'default'
      );

      // Build filter description for response
      const filterDescription: string[] = [];
      if (service) filterDescription.push(`service: ${service}`);
      if (monthNumber) {
        const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];
        filterDescription.push(`month: ${monthNames[monthNumber - 1]}`);
      }
      if (yearNumber) filterDescription.push(`year: ${yearNumber}`);

      ret_obj['appliedFilters'] = {
        service: service || null,
        month: monthNumber || null,
        year: yearNumber || null,
        description:
          filterDescription.length > 0
            ? filterDescription.join(', ')
            : 'No filters applied',
      };

      console.log(ret_1);
      ret_obj['totalAnomalies'] = ret_1.length;
      ret_obj['openAnomalies'] = ret_1.filter(
        (o) => o.status !== 'CLOSED'
      ).length;
      ret_obj['criticalAnomalies'] = ret_1.filter((o) => {
        const crit = o.criticality ?? 0;
        return crit > 9;
      }).length;
      ret_obj['highPriorityAnomalies'] = ret_1.filter((o) => {
        const crit = o.criticality ?? 0;
        return crit >= 7 && crit <= 8;
      }).length;
      // Calculate real average resolution time
      const resolvedAnomalies = ret_1.filter((o) => o.status === 'CLOSED');
      let averageResolutionTime = 0;

      if (resolvedAnomalies.length > 0) {
        const totalResolutionTime = resolvedAnomalies.reduce((sum, anomaly) => {
          const createdAt = new Date(anomaly.createdAt);
          const updatedAt = new Date(anomaly.updatedAt);
          const resolutionTimeHours =
            (updatedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
          return sum + resolutionTimeHours;
        }, 0);
        averageResolutionTime =
          Math.round((totalResolutionTime / resolvedAnomalies.length) * 100) /
          100;
      }

      ret_obj['averageResolutionTime'] = averageResolutionTime;
      ret_obj['anomaliesByStatus'] = {
        'en-cours': ret_1.filter((o) => o.status === 'IN_PROGRESS').length,
        traité: ret_1.filter((o) => o.status === 'TREATED').length,
        cloturé: ret_1.filter((o) => o.status === 'CLOSED').length,
      };
      ret_obj['anomaliesByCriticality'] = {
        normal: ret_1.filter((o) => o.criticality! >= 3 && o.criticality! <= 6)
          .length,
        high: ret_1.filter((o) => o.criticality! >= 7 && o.criticality! <= 8)
          .length,
        critical: ret_1.filter((o) => o.criticality! > 9).length,
      };
      // Calculate real anomalies by unit/equipment
      const anomaliesByUnit = {};
      ret_1.forEach((value) => {
        const equipment = value.equipment || 'Unknown';
        if (!anomaliesByUnit[equipment]) {
          anomaliesByUnit[equipment] = 0;
        }
        anomaliesByUnit[equipment] += 1;
      });
      console.log('Anomalies by unit:', anomaliesByUnit);
      ret_obj['anomaliesByUnit'] = anomaliesByUnit;
      ret_obj['safetyImpactMetrics'] = {
        noRisk: ret_1.filter((o) => o.criticality! >= 3 && o.criticality! <= 6)
          .length,
        minorRisk: ret_1.filter(
          (o) => o.criticality! >= 7 && o.criticality! <= 8
        ).length,
        majorRisk: ret_1.filter((o) => o.criticality! > 9).length,
      };
      ret_obj['availabilityImpactMetrics'] = {
        noImpact: ret_1.filter(
          (o) => o.criticality! >= 3 && o.criticality! <= 6
        ).length,
        partialImpact: ret_1.filter(
          (o) => o.criticality! >= 7 && o.criticality! <= 8
        ).length,
        significantImpact: ret_1.filter((o) => o.criticality! > 9).length,
      };
      // Calculate trend analysis with real data
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Get start and end dates for current month
      const currentMonthStart = new Date(currentYear, currentMonth, 1);
      const currentMonthEnd = new Date(
        currentYear,
        currentMonth + 1,
        0,
        23,
        59,
        59
      );

      // Get start and end dates for last month
      const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
      const lastMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

      // Count anomalies for current month
      const thisMonthAnomalies = ret_1.filter((anomaly) => {
        const createdAt = new Date(anomaly.createdAt);
        return createdAt >= currentMonthStart && createdAt <= currentMonthEnd;
      }).length;

      // Count anomalies for last month
      const lastMonthAnomalies = ret_1.filter((anomaly) => {
        const createdAt = new Date(anomaly.createdAt);
        return createdAt >= lastMonthStart && createdAt <= lastMonthEnd;
      }).length;

      // Calculate percentage change
      const percentageChange =
        lastMonthAnomalies === 0
          ? thisMonthAnomalies > 0
            ? 100
            : 0
          : ((thisMonthAnomalies - lastMonthAnomalies) / lastMonthAnomalies) *
            100;

      ret_obj['trendAnalysis'] = {
        thisMonth: thisMonthAnomalies,
        lastMonth: lastMonthAnomalies,
        percentageChange: Math.round(percentageChange * 100) / 100, // Round to 2 decimal places
      };
      ret_obj['recentAnomalies'] = ret_1.slice(0, 5);
      ret_obj['upcomingMaintenance'] =
        await this.maintainanceWindowService.findAll();

      // Calculate real maintenance window utilization
      const totalAnomalies = ret_1.length;
      const anomaliesWithMaintenance = ret_1.filter(
        (o) => o.maintenanceWindowId !== null
      ).length;
      const maintenanceWindowUtilization =
        totalAnomalies > 0
          ? Math.round(
              (anomaliesWithMaintenance / totalAnomalies) * 100 * 100
            ) / 100
          : 0;

      ret_obj['maintenanceWindowUtilization'] = maintenanceWindowUtilization;

      // Get anomaly counts by month for the current year or specified year
      const targetYear = yearNumber || new Date().getFullYear();
      const anomalyByMonth =
        await this.anomalyService.getAnomaliesByMonthInYear(
          service,
          targetYear,
          criticality || 'default'
        );
      ret_obj['anomalyByMonth'] = anomalyByMonth;
    } catch (error: unknown) {
      console.error('Error generating dashboard:', error);
      throw new InternalServerErrorException(
        'Failed to generate dashboard metrics'
      );
    }
    return ret_obj;
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Anomaly, // for a object
    description: 'anomaly by id',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'anomaly ID' })
  async findOne(@Param('id') id: string) {
    try {
      const anomaly = await this.anomalyService.findOne(+id);
      if (!anomaly) {
        throw new NotFoundException(`Anomaly with ID ${id} not found`);
      }
      return anomaly;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching anomaly:', error);
      throw new InternalServerErrorException('Failed to fetch anomaly');
    }
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'number', description: 'anomaly ID' })
  @ApiBody({ type: UpdateAnomalyDto })
  @ApiResponse({
    status: 200,
    type: Anomaly, // for a list
    description: 'updated anomaly',
  })
  async update(
    @Param('id') id: string,
    @Body() updateAnomalyDto: Prisma.AnomalyUpdateInput
  ) {
    try {
      const updatedAnomaly = await this.anomalyService.update(
        +id,
        updateAnomalyDto
      );
      if (!updatedAnomaly) {
        throw new NotFoundException(`Anomaly with ID ${id} not found`);
      }
      return updatedAnomaly;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating anomaly:', error);
      throw new InternalServerErrorException('Failed to update anomaly');
    }
  }

  @ApiParam({ name: 'id', type: 'number', description: 'anomaly ID' })
  @ApiResponse({
    status: 200,
    type: Anomaly,
    description: 'delete anomaly',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deletedAnomaly = await this.anomalyService.remove(+id);
      if (!deletedAnomaly) {
        throw new NotFoundException(`Anomaly with ID ${id} not found`);
      }
      return deletedAnomaly;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error deleting anomaly:', error);
      throw new InternalServerErrorException('Failed to delete anomaly');
    }
  }

  @Get('/attach/:fileName')
  async getAttachment(
    @Param('fileName') fileName: string,
    @Res() res: Response
  ) {
    //   const filePath = join(__dirname, '..', '..', 'uploads', fileName);
    // async getAttachment(@Param('fileName') fileName: string, @Res() res: Response) {
    try {
      const filePath = join(__dirname, '..', '..', 'uploads', fileName);

      if (!fs.existsSync(filePath)) {
        throw new NotFoundException(`File ${fileName} not found`);
      }

      return res.sendFile(filePath);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error retrieving attachment:', error);
      throw new InternalServerErrorException('Failed to retrieve attachment');
    }
  }

  @Post(':id/attach')
  @UseInterceptors(AnyFilesInterceptor()) // Accepts all files temporarily in memory or stream
  async uploadFile(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      const anomaly = await this.anomalyService.findOne(+id);
      if (!anomaly) {
        throw new NotFoundException(`Anomaly with ID ${id} does not exist`);
      }

      const file = files[0];
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf|csv|xlsx|xls|xlsm)$/)) {
        throw new BadRequestException(
          'Only image, PDF and tabular format files are allowed!'
        );
      }

      const uploadsDir = './uploads';
      const { name, ext } = parse(file.originalname);
      let finalName = `${name}${ext}`;
      let counter = 1;

      while (fs.existsSync(join(uploadsDir, finalName))) {
        finalName = `${name}(${counter})${ext}`;
        counter++;
      }

      const filePath = join(uploadsDir, finalName);
      fs.writeFileSync(filePath, file.buffer);

      await this.anomalyService.addAttach(+id, finalName);

      return {
        message: 'File uploaded successfully',
        file: {
          originalname: file.originalname,
          filename: finalName,
          path: filePath,
          mimetype: file.mimetype,
          size: file.size,
        },
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      console.error('Error uploading file:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  @Post('/anomaly-file-submission')
  @UseInterceptors(FileInterceptor('file'))
  async anomaly_file_submittion(@UploadedFile() file: Express.Multer.File) {
    try {
      console.log('file', file);
      const formData = new FormData();
      formData.append('file', new Blob([file.buffer]), file.originalname);
      const axios_ret = await axios.post(
        'https://c6286854c291.ngrok-free.app/predict',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(axios_ret.data);

      // Process and save each anomaly from the results
      const savedAnomalies: any[] = [];
      const apiResponse = axios_ret.data as ExternalApiResponse;

      for (const result of apiResponse.results) {
        try {
          const { original_data, predictions } = result;

          // Map external data to Anomaly model fields
          const anomalyData: Prisma.AnomalyCreateInput = {
            description: original_data.description || '',
            equipementDescription:
              original_data.description_de_lequipement || '',
            equipment: original_data.num_equipement || '',
            detectionDate: original_data.date_de_detection_de_lanomalie
              ? new Date(original_data.date_de_detection_de_lanomalie)
              : new Date(),
            service: original_data.section_proprietaire || '',
            system: original_data.systeme || '', // Using equipment number as tags

            // Original values from original_data
            integrity: original_data.fiabilite_integrite || null,
            disponibility: original_data.disponibilte || null,
            processSafety: original_data.process_safety || null,
            criticality: original_data.criticite || null,

            // Predicted values from predictions
            predictedIntegrity: predictions?.['Fiabilité Intégrité']
              ? predictions['Fiabilité Intégrité']
              : null,
            predictedDisponibility: predictions?.['Disponibilité']
              ? predictions['Disponibilité']
              : null,
            predictedProcessSafety: predictions?.['Process Safety']
              ? predictions['Process Safety']
              : null,

            // Store full predictions data as JSON
            predictionsData: predictions || null,

            // Default values for required fields
            status: 'IN_PROGRESS',
            sysShutDownRequired: false,
            forcedAssigned: false,
          };

          // Use predicted criticality if available, otherwise use original
          if (predictions?.['Criticité']) {
            anomalyData.criticality = predictions['Criticité'];
          }

          const savedAnomaly = await this.anomalyService.create(anomalyData);
          savedAnomalies.push(savedAnomaly);

          console.log(`Anomaly saved with ID: ${savedAnomaly.id}`);
        } catch (error) {
          console.error('Error saving individual anomaly:', error);
          // Continue processing other anomalies even if one fails
        }
      }

      return {
        message: 'File uploaded successfully',
        success: true,
        data: axios_ret.data,
        savedAnomalies: savedAnomalies,
        totalSaved: savedAnomalies.length,
      };
    } catch (error: any) {
      console.log('error', error);
    }
  }

  @Post('/save-external-anomaly')
  @ApiOperation({
    summary: 'Save external anomaly data',
    description:
      'Maps and saves external anomaly data format into the database',
  })
  @ApiBody({
    description: 'External anomaly data with original_data and predictions',
    schema: {
      type: 'object',
      properties: {
        original_data: {
          type: 'object',
          properties: {
            num_equipement: { type: 'string' },
            systeme: { type: 'string' },
            description: { type: 'string' },
            date_de_detection_de_lanomalie: {
              type: 'string',
              format: 'date-time',
            },
            description_de_lequipement: { type: 'string' },
            section_proprietaire: { type: 'string' },
            fiabilite_integrite: { type: 'number' },
            disponibilte: { type: 'number' },
            process_safety: { type: 'number' },
            criticite: { type: 'number' },
          },
        },
        predictions: {
          type: 'object',
          properties: {
            Disponibilité: { type: 'number' },
            'Process Safety': { type: 'number' },
            'Fiabilité Intégrité': { type: 'number' },
            Criticité: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'External anomaly data saved successfully',
    type: Anomaly,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data format',
  })
  async saveExternalAnomalyData(@Body() externalData: any) {
    try {
      const { original_data, predictions } = externalData;

      if (!original_data || !predictions) {
        throw new BadRequestException(
          'Missing original_data or predictions in request body'
        );
      }

      // Map external data to Anomaly model fields
      const anomalyData: Prisma.AnomalyCreateInput = {
        description: original_data.description || '',
        equipementDescription: original_data.description_de_lequipement || '',
        equipment: original_data.num_equipement || '',
        detectionDate: original_data.date_de_detection_de_lanomalie
          ? new Date(original_data.date_de_detection_de_lanomalie)
          : new Date(),
        service: original_data.section_proprietaire || '',
        system: original_data.systeme || '', // Using systeme as tags

        // Original values from original_data
        integrity: original_data.fiabilite_integrite || null,
        disponibility: original_data.disponibilte || null,
        processSafety: original_data.process_safety || null,
        criticality: original_data.criticite || null,

        // Predicted values from predictions
        predictedIntegrity: predictions['Fiabilité Intégrité']
          ? predictions['Fiabilité Intégrité']
          : null,
        predictedDisponibility: predictions['Disponibilité']
          ? predictions['Disponibilité']
          : null,
        predictedProcessSafety: predictions['Process Safety']
          ? predictions['Process Safety']
          : null,

        // Store full predictions data as JSON
        predictionsData: predictions,

        // Default values
        status: 'IN_PROGRESS',
        sysShutDownRequired: false,
        forcedAssigned: false,
      };

      // Use predicted criticality if available, otherwise use original
      if (predictions['Criticité']) {
        anomalyData.criticality = predictions['Criticité'];
      }
      console.log(anomalyData);
      const savedAnomaly = await this.anomalyService.create(anomalyData);

      return {
        message: 'External anomaly data saved successfully',
        success: true,
        anomaly: savedAnomaly,
      };
    } catch (error: any) {
      console.error('Error saving external anomaly data:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        'Failed to save external anomaly data: ' + error.message
      );
    }
  }
}
