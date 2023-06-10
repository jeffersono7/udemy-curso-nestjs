import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { ParamId } from 'src/decorators/param-id.decorator';

// @UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async list() {
    return this.userService.list();
  }

  @Get(':id')
  async show(@ParamId() id: number) {
    return this.userService.show(id);
  }

  @Put(':id')
  async update(
    @ParamId() id: number,
    @Body() updatePutUserDto: UpdatePutUserDto,
  ) {
    return this.userService.update(id, updatePutUserDto);
  }

  @Patch(':id')
  async partialUpdate(
    @ParamId() id: number,
    @Body() updatePatchUserDto: UpdatePatchUserDto,
  ) {
    return this.userService.update(id, updatePatchUserDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
