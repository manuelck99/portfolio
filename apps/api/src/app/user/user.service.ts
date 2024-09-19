import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common"
import { UserRepository } from "./user.repository"
import { CreateUserDto, UserDto } from "@pf/dto"
import { UserMapper } from "./user.mapper"

@Injectable()
export class UserService {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly userRepo: UserRepository,
  ) {}

  async getUser(id: string): Promise<UserDto> {
    const selectUser = await this.userRepo.getUser(id)
    if (!selectUser) {
      throw new NotFoundException(`User with ID ${id} couldn't be found`)
    }

    return this.userMapper.selectUserToUserDto(selectUser)
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const selectUser = await this.userRepo.createUser(
      this.userMapper.createUserDtoToInsertUser(createUserDto),
    )
    if (!selectUser) {
      throw new InternalServerErrorException("User couldn't be created")
    }

    return this.userMapper.selectUserToUserDto(selectUser)
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepo.deleteUser(id)
    if (result.numDeletedRows <= 0) {
      throw new NotFoundException(`User with ID ${id} couldn't be deleted`)
    }
  }
}
