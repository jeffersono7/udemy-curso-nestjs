import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async createToken() {
    return this.jwtService.signAsync({});
  }

  async checkToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }

  async login(email: string, password: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      throw new BadRequestException('Email e/ou senha incorretos!');
    }

    return user;
  }

  async forget(email: string) {
    const user = this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('Email está incorreto!');
    }

    // TODO enviar o e-mail

    return true;
  }

  async reset(newPassword: string, token: string) {
    // TODO: validar o token;
    const id = 0;

    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        password: newPassword,
      },
    });

    return true;
  }
}
