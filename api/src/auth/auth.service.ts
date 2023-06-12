import { AuthRegisterDto } from './dto/auth-register.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly issuer = 'login';
  private readonly audience = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async checkToken(token: string) {
    return this.jwtService
      .verifyAsync(token, {
        audience: this.audience,
        issuer: this.issuer,
      })
      .catch((e) => {
        return new BadRequestException(e);
      });
  }

  async isValidToken(token: string) {
    return this.checkToken(token)
      .then(() => true)
      .catch(() => false);
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

    return this.createToken(user);
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

    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        password: newPassword,
      },
    });

    return this.createToken(user);
  }

  async register(data: AuthRegisterDto) {
    const user = await this.userService.create(data);

    return this.createToken(user);
  }

  private async createToken(user: User) {
    return this.jwtService.signAsync(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      {
        expiresIn: '7 days',
        subject: user.id.toString(),
        issuer: this.issuer,
        audience: this.audience,
      },
    );
  }
}
