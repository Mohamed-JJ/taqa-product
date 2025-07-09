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
import { CommentsService } from './comments.service';
import { Prisma } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  // ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateCommentDto, CommentResponse } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PassPortJwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('comments')
@ApiTags('comments')
// @ApiBearerAuth()
@UseGuards(PassPortJwtGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new comment',
    description: 'Creates a new comment for an anomaly',
  })
  @ApiBody({
    type: CreateCommentDto,
    description: 'Comment data to create',
  })
  @ApiResponse({
    description: 'Comment successfully created',
    type: CommentResponse,
  })
  create(@Body() createCommentDto: Prisma.commentsCreateInput) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all comments',
    description: 'Retrieves a list of all comments in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'List of comments retrieved successfully',
    type: [CommentResponse],
  })
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get comment by ID',
    description: 'Retrieves a specific comment by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the comment to retrieve',
    example: 1,
  })
  @ApiResponse({
    description: 'Comment retrieved successfully',
    type: CommentResponse,
  })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update comment by ID',
    description: 'Updates an existing comment with new data',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the comment to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateCommentDto,
    description: 'Comment data to update',
  })
  @ApiResponse({
    description: 'Comment updated successfully',
    type: CommentResponse,
  })
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: Prisma.commentsUpdateInput
  ) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete comment by ID',
    description: 'Deletes a comment from the system',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the comment to delete',
    example: 1,
  })
  @ApiResponse({
    description: 'Comment deleted successfully',
    type: CommentResponse,
  })
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
