import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChangeHistoryService } from './change-history.service';
import { CreateChangeHistoryDto } from './dto/create-change-history.dto';
import { UpdateChangeHistoryDto } from './dto/update-change-history.dto';
import { Prisma } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  // ApiBearerAuth,
} from '@nestjs/swagger';
import { ChangeHistoryResponse } from './dto/create-change-history.dto';
import { PassPortJwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('change-history')
@ApiTags('change-history')
// @ApiBearerAuth()
@UseGuards(PassPortJwtGuard)
export class ChangeHistoryController {
  constructor(private readonly changeHistoryService: ChangeHistoryService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new change history record',
    description:
      'Creates a new change history record for tracking anomaly modifications',
  })
  @ApiBody({
    type: CreateChangeHistoryDto,
    description: 'Change history data to create',
  })
  @ApiResponse({
    description: 'Change history record successfully created',
    type: ChangeHistoryResponse,
  })
  create(@Body() createChangeHistoryDto: Prisma.changeHistoryCreateInput) {
    return this.changeHistoryService.create(createChangeHistoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all change history records',
    description: 'Retrieves a list of all change history records in the system',
  })
  @ApiResponse({
    description: 'List of change history records retrieved successfully',
    type: [ChangeHistoryResponse],
  })
  findAll() {
    return this.changeHistoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get change history record by ID',
    description: 'Retrieves a specific change history record by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the change history record to retrieve',
    example: 1,
  })
  @ApiResponse({
    description: 'Change history record retrieved successfully',
    type: ChangeHistoryResponse,
  })
  findOne(@Param('id') id: string) {
    return this.changeHistoryService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update change history record by ID',
    description: 'Updates an existing change history record with new data',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the change history record to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateChangeHistoryDto,
    description: 'Change history data to update',
  })
  @ApiResponse({
    description: 'Change history record updated successfully',
    type: ChangeHistoryResponse,
  })
  update(
    @Param('id') id: string,
    @Body() updateChangeHistoryDto: Prisma.changeHistoryUpdateInput
  ) {
    return this.changeHistoryService.update(+id, updateChangeHistoryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete change history record by ID',
    description: 'Deletes a change history record from the system',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the change history record to delete',
    example: 1,
  })
  @ApiResponse({
    description: 'Change history record deleted successfully',
    type: ChangeHistoryResponse,
  })
  remove(@Param('id') id: string) {
    return this.changeHistoryService.remove(+id);
  }
}
