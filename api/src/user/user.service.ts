import {
  ImATeapotException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUserDto) {
    let birthAt: Date | string = data.birthAt;

    if (data.birthAt) {
      birthAt = new Date(birthAt);
    }

    return await this.prismaService.user.create({
      data: { ...data, birthAt },
    });
  }

  async list() {
    return this.prismaService.user.findMany();
  }

  async show(id: number) {
    await this.assertThatUserExists(id);

    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: UpdatePutUserDto | UpdatePatchUserDto) {
    await this.assertThatUserExists(id);

    let birthAt: Date | string = data.birthAt;

    if (data.birthAt) {
      birthAt = new Date(birthAt);
    }

    return this.prismaService.user.update({
      data: { ...data, birthAt },
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    await this.assertThatUserExists(id);

    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  async assertThatUserExists(id: number) {
    const count = await this.prismaService.user.count({
      where: {
        id,
      },
    });

    if (!count) {
      throw new NotFoundException('Usuario nao existe!');
    }
  }
}
