import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';  
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { NotesModule } from '../notes/notes.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  
    forwardRef(() => NotesModule)
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,  
      useFactory: (dataSource: DataSource) => {
        return new UserRepository(dataSource); 
      },
      inject: [getDataSourceToken()],
    },
  ],
  exports: [UserService, UserRepository]  
})
export class UserModule {}
