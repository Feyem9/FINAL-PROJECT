import { 
  Controller, Get, Post, Body, Param, Put, Delete, UsePipes, ValidationPipe, NotFoundException, BadRequestException 
} from '@nestjs/common';
import { MusicResourcesService } from './resource.service';
import { CreateMusicResourceDto, UpdateMusicResourceDto } from '../../DTO/resource.dto';
import { MusicResource } from '../../schema/resource.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('music-resources')
@Controller('resources')
export class MusicResourcesController {
  constructor(private readonly musicResourcesService: MusicResourcesService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create a music resource' })
  @ApiResponse({ status: 201, description: 'The music resource has been successfully created.', type: MusicResource })
  @ApiBody({ type: CreateMusicResourceDto })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createMusicResourceDto: CreateMusicResourceDto): Promise<MusicResource> {
    try {
      return await this.musicResourcesService.create(createMusicResourceDto);
    } catch (error) {
      throw new BadRequestException('Invalid data for music resource creation');
    }
  }

  @Get('/all')
  @ApiOperation({ summary: 'Get all music resources' })
  @ApiResponse({ status: 200, description: 'Return all music resources.', type: [MusicResource] })
  async findAll(): Promise<MusicResource[]> {
    return this.musicResourcesService.findAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a music resource by ID' })
  @ApiResponse({ status: 200, description: 'Return the music resource.', type: MusicResource })
  @ApiParam({ name: 'id', description: 'The ID of the music resource' })
  async findOne(@Param('id') id: string): Promise<MusicResource> {
    const resource = await this.musicResourcesService.findOne(id);
    if (!resource) {
      throw new NotFoundException(`Music resource with id ${id} not found`);
    }
    return resource;
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a music resource by ID' })
  @ApiResponse({ status: 200, description: 'The music resource has been successfully updated.', type: MusicResource })
  @ApiParam({ name: 'id', description: 'The ID of the music resource' })
  @ApiBody({ type: UpdateMusicResourceDto })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: string,
    @Body() updateMusicResourceDto: UpdateMusicResourceDto
  ): Promise<MusicResource> {
    const updated = await this.musicResourcesService.update(id, updateMusicResourceDto);
    if (!updated) {
      throw new NotFoundException(`Music resource with id ${id} not found`);
    }
    return updated;
  }

  @Delete(' /:id')
  @ApiOperation({ summary: 'Delete a music resource by ID' })
  @ApiResponse({ status: 200, description: 'The music resource has been successfully deleted.', type: MusicResource })
  @ApiParam({ name: 'id', description: 'The ID of the music resource' })
  async delete(@Param('id') id: string): Promise<MusicResource> {
    const deleted = await this.musicResourcesService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Music resource with id ${id} not found`);
    }
    return deleted;
  }
}
