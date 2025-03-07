import { Controller, Post, Get, Delete, Body, Param, Req, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { NotesService } from '../notes/notes.service';

@Controller('api/categories')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly notesService: NotesService
    ) {}

    // 🟢 create cat
    @Post(':noteId/categories')
    async createCategoryForNote(
        @Param('noteId') noteId: number,
        @Body('name') name: string,
        @Req() request
    ) {
        const userId = request.session.userId;
        if (!userId) {
            throw new UnauthorizedException('Usuario no autenticado');
        }
        return this.categoryService.createCategoryForNote(noteId, name, userId);
    }
    
    @Get(':noteId/categories')
    async getCategoriesForNote(
      @Param('noteId') noteId: number,
      @Req() request
    ) {
      const userId = request.session.userId;
      return this.categoryService.getCategoriesForNote(noteId, userId);
    }
    // 🟢 delete categories
    @Delete(':noteId/:categoryName')
    async removeCategoryFromNote(
        @Param('noteId') noteId: number,
        @Param('categoryName') categoryName: string,
        @Req() request
    ) {
        const userId = request.session.userId;  
        if (!userId) {
            throw new UnauthorizedException('Usuario no autenticado');
        }

        return this.notesService.removeCategoryFromNote(noteId, categoryName, userId);
    }

    // 🟢 receive cats
    @Get()
    async getAllCategories(@Req() request) {
        const userId = request.session?.userId;
        if (!userId) {
            throw new UnauthorizedException('Usuario no autenticado');
        }
    
        return this.categoryService.findAll();
    }

      // 🟢 receive notes from category
  @Get(':categoryId/notes')
  async getNotesByCategory(
    @Param('categoryId') categoryId: number,
    @Req() request
  ) {
    const userId = request.session.userId; 
    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    return this.categoryService.getNotesByCategory(categoryId, userId);
  }
}
