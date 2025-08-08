import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Headers } from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto, UpdateNoteDto } from '../../DTO/note.dto';

@Controller('notes')
export class NoteController {
    constructor(private readonly noteService: NoteService) { }

    @Post()
    async create(@Body() createNoteDto: CreateNoteDto, @Headers('x-user-id') userId: string) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        return this.noteService.create(createNoteDto, userId);
    }

    @Get()
    async findAllByUser(@Headers('x-user-id') userId: string) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        return this.noteService.findAllByUser(userId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Headers('x-user-id') userId: string) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        return this.noteService.findOne(id, userId);
    }
    

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto, @Headers('x-user-id') userId: string) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        return this.noteService.update(id, updateNoteDto, userId);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Headers('x-user-id') userId: string) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        return this.noteService.remove(id, userId);
    }
}