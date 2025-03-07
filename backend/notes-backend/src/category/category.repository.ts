import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }


  async findByName(name: string): Promise<Category | null> {
    return this.findOne({ where: { name } });
  }

  async findAll(): Promise<Category[]> {
    return this.find();
  }

  async findById(id: number): Promise<Category | null> {
    return this.findOne({ where: { id } });
  }
}
