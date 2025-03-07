import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 
  app.enableCors({
    origin: ['http://localhost:3001', 'http://192.168.1.62:3001'], 
    credentials: true,                  
  });


  app.use(
    session({
      secret: process.env.SESION_PW,  
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60 * 60 * 1000,         
        secure: false,                 
        httpOnly: true,                 
       
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
