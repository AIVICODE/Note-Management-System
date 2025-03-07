import { Repository, DataSource } from 'typeorm';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

   
    async findByUsername(username: string): Promise<User | null> {
        return this.findOne({ where: { username } });
    }

    
    async findById(id: number): Promise<User | null> {
        return this.findOne({ where: { id } });
    }

   
    async createUser(username: string, password: string): Promise<User> {
        const newUser = this.create({ username, password });
        return this.save(newUser);
    }
}
