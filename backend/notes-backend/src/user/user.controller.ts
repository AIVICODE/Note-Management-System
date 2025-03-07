import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Note } from '../notes/notes.entity';

@Controller('api/users')  
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()  // POST to /api/users
  async createUser(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<User> {
    return this.userService.createUser(username, password);
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    return this.userService.findUserById(id);
  }

  
  @Post(':id/notes')  // POST to /api/users/:id/notes
  async createNoteForUser(
    @Param('id') userId: number,
    @Body() noteData: Partial<Note>,
  ): Promise<Note> {
    return this.userService.createNoteForUser(userId, noteData);
  }

  
  @Get(':id/notes')  // GET to /api/users/:id/notes
  async getUserNotes(@Param('id') userId: number): Promise<Note[]> {
    return this.userService.getUserNotes(userId);
  }
}
