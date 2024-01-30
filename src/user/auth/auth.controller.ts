import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupParams } from '../dto/sign-up-params.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignupParams): Promise<object> {
    return this.authService.signup(body);
  }
  @Delete('/:email')
  async deleteAccount(@Param('email') email: any): Promise<string> {
    return this.authService.removeAccount(email);
  }
}
