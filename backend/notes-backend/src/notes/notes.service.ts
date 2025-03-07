import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { NotesRepository } from './notes.repository';
import { Note } from './notes.entity';
import { CategoryService } from '../category/category.service';
import { Category } from 'src/category/category.entity';

@Injectable()
export class NotesService {
  constructor(
    @Inject(NotesRepository)  
    private readonly notesRepository: NotesRepository,
    private readonly categoryService: CategoryService,
  ) {}

  async create(note: Partial<Note>, userId: number): Promise<Note> {
    return this.notesRepository.createNote(note, userId);
  }

  async getAllNotesByUser(userId: number): Promise<Note[]> {
    return this.notesRepository.findAllNotesByUser(userId);
  }

  async getNoteById(noteId: number, userId: number): Promise<Note | null> {
    return await this.notesRepository.findOne({
      where: {
        id: noteId,
        user: { id: userId }
      },
      relations: ['categories'] 
    });
  }
  

  async delete(noteId: number, userId: number): Promise<void> {
    await this.getNoteById(noteId, userId);
    await this.notesRepository.deleteById(noteId);
  }



  async updateNoteTitle(noteId: number, title: string, userId: number): Promise<Note> {
    const note = await this.getNoteById(noteId, userId);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    note.title = title;
    
    return this.notesRepository.save(note);
  }

  async updateNoteContent(noteId: number, content: string, userId: number): Promise<Note> {
    const note = await this.getNoteById(noteId, userId);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    note.content = content;
    return this.notesRepository.save(note);
  }

  async archiveNote(noteId: number, userId: number): Promise<Note> {
    const note = await this.getNoteById(noteId, userId);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    note.archived = true;
    return this.notesRepository.save(note);
  }

  async unarchiveNote(noteId: number, userId: number): Promise<Note> {
    const note = await this.getNoteById(noteId, userId);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    note.archived = false;
    return this.notesRepository.save(note);
  }

  async toggleArchiveNote(noteId: number, userId: number): Promise<Note> {
    const note = await this.getNoteById(noteId, userId);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    note.archived = !note.archived;
    return this.notesRepository.save(note);
  }

  async getActiveNotesByUser(userId: number): Promise<Note[]> {
    return this.notesRepository.findActiveNotesByUser(userId);
  }

  async getArchivedNotesByUser(userId: number): Promise<Note[]> {
    return this.notesRepository.findArchivedNotesByUser(userId);
  }

  async addCategoryToNote(noteId: number, categoryName: string, userId: number): Promise<Note> {
    const note = await this.getNoteById(noteId, userId);
    const category = await this.categoryService.findByName(categoryName);
    
    if (!category) {
        throw new NotFoundException(`Categoría ${categoryName} no encontrada`);
    }
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    
    note.categories = note.categories ? [...note.categories, category] : [category];
    return this.notesRepository.save(note);
}

async removeCategoryFromNote(noteId: number, categoryName: string, userId: number): Promise<Note> {
    const note = await this.getNoteById(noteId, userId);
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    note.categories = note.categories ? note.categories.filter(cat => cat.name !== categoryName) : [];
    return this.notesRepository.save(note);
}

async updateNoteCategories(noteId: number, categories: Category[], userId: number): Promise<void> {
    const note = await this.getNoteById(noteId, userId);
    if (!note) {
        throw new NotFoundException('Note not found');
    }

    note.categories = categories;
    await this.notesRepository.save(note);
}
async findNotesByCategoryAndUser(categoryId: number, userId: number): Promise<Note[]> {
  return this.notesRepository.find({
    where: {
      user: { id: userId },
      categories: { id: categoryId }
    },
    relations: ['categories']
  });
}

}
