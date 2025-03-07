import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { Category } from './category.entity';
import { NotesModule } from '../notes/notes.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    forwardRef(() => NotesModule) 
  ],
  providers: [
    CategoryService,
    {
      provide: CategoryRepository,
      useFactory: (dataSource: DataSource) => {
        return new CategoryRepository(dataSource); 
      },
      inject: [getDataSourceToken()],
    },
  ],
  controllers: [CategoryController],
  exports: [CategoryService, CategoryRepository]
})
export class CategoryModule {}
