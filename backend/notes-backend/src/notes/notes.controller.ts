import { Controller, Get, Post, Body, Delete, Param, Patch, Put, Req, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from './notes.entity';

@Controller('api/notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) {}


    @Get()
    async getAllNotes(@Req() request): Promise<Note[]> {
        const userId = request.session.userId;
        return this.notesService.getAllNotesByUser(userId);
    }


    @Get('/active')
    async getActiveNotes(@Req() request): Promise<Note[]> {
        const userId = request.session.userId;
        return this.notesService.getActiveNotesByUser(userId);
    }

    @Get('/archived')
    async getArchivedNotes(@Req() request): Promise<Note[]> {
        const userId = request.session.userId;
        return this.notesService.getArchivedNotesByUser(userId);
    }


    @Post()
    async create(@Body() note: Partial<Note>, @Req() request): Promise<Note> {
        const userId = request.session.userId;
        return this.notesService.create(note, userId);
    }


    @Get(':id')
    async getNoteById(@Param('id') noteId: number, @Req() request): Promise<Note | null> {
        const userId = request.session.userId;
        return this.notesService.getNoteById(noteId, userId);
    }
    


    @Delete(':id')
    async delete(@Param('id') noteId: number, @Req() request): Promise<void> {
        const userId = request.session.userId;
        return this.notesService.delete(noteId, userId);
    }


    @Patch(':id/title')
    async updateNoteTitle(
        @Param('id') noteId: number,
        @Body('title') title: string,
        @Req() request
    ): Promise<Note> {
        const userId = request.session.userId;
        return this.notesService.updateNoteTitle(noteId, title, userId);
    }


    @Patch(':id/content')
    async updateNoteContent(
        @Param('id') noteId: number,
        @Body('content') content: string,
        @Req() request
    ): Promise<Note> {
        const userId = request.session.userId;
        return this.notesService.updateNoteContent(noteId, content, userId);
    }


    @Put(':id/archive')
    async archiveNote(
        @Param('id') noteId: number,
        @Req() request
    ): Promise<Note> {
        const userId = request.session.userId;
        return this.notesService.archiveNote(noteId, userId);
    }


    @Put(':id/unarchive')
    async unarchiveNote(
        @Param('id') noteId: number,
        @Req() request
    ): Promise<Note> {
        const userId = request.session.userId;
        return this.notesService.unarchiveNote(noteId, userId);
    }


    @Patch(':id/toggle-archive')
    async toggleArchiveNote(
        @Param('id') noteId: number,
        @Req() request
    ): Promise<Note> {
        const userId = request.session.userId;
        return this.notesService.toggleArchiveNote(noteId, userId);
    }
}

export default NotesController;
