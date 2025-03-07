import { Controller, Post, Body,Get, Req, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Controller('api/auth') 
export class AuthController {  
  constructor(private readonly usersService: UserService) {}


  @Post('/login')
  async login(
    @Body() body: { username: string; password: string },  
    @Req() request
  ) {
    const user = await this.usersService.findUserByUsername(body.username); 

    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);  

    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    request.session.userId = user.id; 
    return { message: 'Inicio de sesión exitoso' };
  }
  @Post('/register')
    async register(@Body() body: { username: string; password: string }) {
        const { username, password } = body;


        const existingUser = await this.usersService.findUserByUsername(username);
        if (existingUser) {
            throw new ConflictException('El usuario ya existe');
        }


        const user = await this.usersService.createUser(username, password);
        return { message: 'Usuario registrado con éxito', userId: user.id };
    }

  // 🟢 Logout
  @Post('/logout')
  async logout(@Req() request) {
    request.session.destroy();  
    return { message: 'Sesión cerrada' };
  }

  @Get('/session')
  async checkSession(@Req() request) {
    if (request.session.userId) {
      return { authenticated: true };
    } else {
      return { authenticated: false };
    }
  }
}
export default AuthController;