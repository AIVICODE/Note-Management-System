import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Note } from 'src/notes/notes.entity';
import { NotesService } from 'src/notes/notes.service';
import { UserRepository } from './user.repository';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private readonly notesService: NotesService,
  ) { }

  async createUser(username: string, password: string): Promise<User> {
    try {
      const existingUser = await this.findUserByUsername(username);
      if (existingUser) {
        throw new ConflictException('El usuario ya existe');
      }
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.userRepository.createUser(username, hashedPassword);
    return user;
  }
  async findUserByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findByUsername(username);
    return user || null;
  }

  async createNoteForUser(userId: number, noteData: Partial<Note>): Promise<Note> {
    const user = await this.findUserById(userId);
    return this.notesService.create(noteData, user.id);  
  }


  async getUserNotes(userId: number): Promise<Note[]> {
    return this.notesService.getAllNotesByUser(userId);  
  }


  async getActiveNotes(userId: number): Promise<Note[]> {
    return this.notesService.getActiveNotesByUser(userId);  
  }


  async getArchivedNotes(userId: number): Promise<Note[]> {
    return this.notesService.getArchivedNotesByUser(userId);  
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID: ${id} no encontrado`);
    }
    return user;
  }

  async verifyPassword(username: string, password: string): Promise<boolean> {
    const user = await this.findUserByUsername(username);
    if (user == null) {
      throw new NotFoundException(`Usuario no encontrado`);
    }
    return bcrypt.compare(password, user.password);
  }
}
