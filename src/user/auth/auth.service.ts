import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SignupParams } from '../dto/sign-up-params.interface';
import { ConflictException } from '../../exceptions/conflict.exception';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';
import { User } from '../entities/user.entity';
import * as process from 'process';
import { InternalErrorServerException } from '../../exceptions/internal-error-server.exception';
@Injectable()
export class AuthService {
  saltOrRounds = 10;
  internalErrorServerMessage: string = `Something went wrong \ntimestamp: ${new Date().toISOString()}`;
  constructor(private readonly prismaService: PrismaService) {}
  async signup({
    email_address,
    password,
    full_name,
    phone_number,
  }: SignupParams): Promise<object> {
    const userExists: User = await this.prismaService.user.findUnique({
      where: {
        email_address,
      },
    });
    if (userExists) {
      throw new ConflictException(
        `this email is already provided ${email_address} 
        \ntimestamp : ${new Date().toISOString()}`,
      );
    }
    const hashedPassword: string = await bcrypt.hash(
      password,
      this.saltOrRounds,
    );
    const newUser: User = await this.prismaService.user.create({
      data: {
        email_address,
        full_name,
        phone_number,
        password: hashedPassword,
        user_type: UserType.BUYER,
      },
    });
    const token: string = jwt.sign(
      {
        full_name,
        id: newUser.id,
      },
      process.env.JSON_TOKEN_SECRET_KEY,
      {
        expiresIn: 36 * 5,
        algorithm: 'HS512',
      },
    );
    if (!token) {
      throw new InternalErrorServerException(
        this.internalErrorServerMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { token };
  }

  async removeAccount({ email_address }): Promise<string> {
    const userExist: User = await this.prismaService.user.findFirst({
      where: email_address,
    });
    if (!userExist) {
      throw new NotFoundException(
        `user withprovided email: ${email_address} is not found`,
      );
    }
    await this.prismaService.user.delete({
      where: userExist,
    });
    return `well done`;
  }
}
