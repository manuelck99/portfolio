import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { CreateUserDto, createUserDtoSchema, UserDto } from "@pf/dto"
import { ZodPipe } from "../validation/zod.pipe"
import { uuidSchema } from "../validation/uuid.schema"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":ID")
  @HttpCode(HttpStatus.OK)
  async getUser(
    @Param("ID", new ZodPipe(uuidSchema)) id: string,
  ): Promise<UserDto> {
    return this.userService.getUser(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body(new ZodPipe(createUserDtoSchema))
    createUserDto: CreateUserDto,
  ): Promise<UserDto> {
    return this.userService.createUser(createUserDto)
  }

  @Delete(":ID")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(
    @Param("ID", new ZodPipe(uuidSchema)) id: string,
  ): Promise<void> {
    return this.userService.deleteUser(id)
  }
}
