import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';
import { Note } from '../notes/notes.entity';
import { NotesService } from '../notes/notes.service';

@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository,
        @Inject(forwardRef(() => NotesService))
        private readonly notesService: NotesService,
    ) { }

    async createCategoryForNote(noteId: number, categoryData: string | string[], userId: number): Promise<Category[]> {
        const note = await this.notesService.getNoteById(noteId, userId);
        if (!note) {
            throw new NotFoundException('Note not found');
        }

        const categoryNames = Array.isArray(categoryData) ? categoryData : [categoryData];

        const categoriesToAdd: Category[] = [];

        for (const name of categoryNames) {
            let category = await this.categoryRepository.findOne({ where: { name } });

            if (!category) {
                category = this.categoryRepository.create({ name });
                await this.categoryRepository.save(category);
            }


            const existingCategoryIds = note.categories?.map(cat => cat.id) ?? [];
            if (!existingCategoryIds.includes(category.id)) {
                categoriesToAdd.push(category);
            }
        }

        if (categoriesToAdd.length > 0) {
            note.categories = [...(note.categories ?? []), ...categoriesToAdd];
            await this.notesService.updateNoteCategories(noteId, note.categories, userId);
        }

        return note.categories ?? [];

    }





    async findByName(name: string): Promise<Category | null> {
        return await this.categoryRepository.findOne({ where: { name } });
    }


    async deleteCategoryByName(name: string): Promise<void> {
        const category = await this.findByName(name);
        if (category) {
            await this.categoryRepository.delete(category.id);
        }
    }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    async createCategory(name: string): Promise<Category> {
        const newCategory = this.categoryRepository.create({ name });
        return this.categoryRepository.save(newCategory);
    }

    async getCategoriesForNote(noteId: number, userId: number): Promise<Category[]> {
        const note = await this.notesService.getNoteById(noteId, userId);
        if (!note) {
            throw new NotFoundException('Note not found');
        }
        return note.categories || [];
    }

    async getNotesByCategory(categoryId: number, userId: number): Promise<Note[]> {
        const category = await this.categoryRepository.findById(categoryId);
        if (!category) {
            throw new NotFoundException(`Categoría con ID ${categoryId} no encontrada`);
        }

        return this.notesService.findNotesByCategoryAndUser(categoryId, userId);
    }
}
