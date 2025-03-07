import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NotesRepository } from './notes.repository';
import { Note } from './notes.entity';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note]),
    forwardRef(() => UserModule),
    forwardRef(() => CategoryModule) 
  ],
  providers: [
    NotesService,
    {
      provide: NotesRepository,
      useFactory: (dataSource: DataSource) => {
        return new NotesRepository(dataSource);  
      },
      inject: [getDataSourceToken()],
    },
  ],
  controllers: [NotesController],
  exports: [NotesService, NotesRepository]
})
export class NotesModule {}
