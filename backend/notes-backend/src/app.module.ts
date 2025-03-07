import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { NotesModule } from './notes/notes.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module'
import { User } from './user/user.entity';
import { Note } from './notes/notes.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Note],
      autoLoadEntities: true,
      synchronize: true,  // only dev mode
    }),
    NotesModule,
    UserModule,
    AuthModule
  ],
})
export class AppModule {}
