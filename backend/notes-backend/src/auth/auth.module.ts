import { Module, forwardRef } from '@nestjs/common';
import AuthController from './auth.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { NotesModule } from '../notes/notes.module'; 

@Module({
  imports: [
    forwardRef(() => UserModule),  
    forwardRef(() => NotesModule) 
  ],
  controllers: [AuthController],
  providers: [UserService],
  exports: [UserService]
})
export class AuthModule {}
