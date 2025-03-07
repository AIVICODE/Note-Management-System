import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Note } from './notes.entity';

@Injectable()
export class NotesRepository extends Repository<Note> {
  constructor(private dataSource: DataSource) {
    super(Note, dataSource.createEntityManager());
  }


  async createNote(note: Partial<Note>, userId: number): Promise<Note> {
    const newNote = this.create({
      ...note,
      user: { id: userId } as any,
    });
    return this.save(newNote);
  }

  async findAllNotesByUser(userId: number): Promise<Note[]> {
    return this.find({ where: { user: { id: userId } } });
  }

  async findByIdAndUser(noteId: number, userId: number): Promise<Note | null> {
    return this.findOne({ where: { id: noteId, user: { id: userId } } });
  }

  async deleteById(noteId: number): Promise<void> {
    await this.delete(noteId);
  }

  async findActiveNotesByUser(userId: number): Promise<Note[]> {
    return this.find({ where: { user: { id: userId }, archived: false } });
  }

  async findArchivedNotesByUser(userId: number): Promise<Note[]> {
    return this.find({ where: { user: { id: userId }, archived: true } });
  }


}
