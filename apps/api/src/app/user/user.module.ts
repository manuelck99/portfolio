import { Module } from "@nestjs/common"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"
import { DbModule } from "../db/db.module"
import { UserMapper } from "./user.mapper"
import { UserRepository } from "./user.repository"

@Module({
  imports: [DbModule],
  controllers: [UserController],
  providers: [UserService, UserMapper, UserRepository],
  exports: [UserService, UserMapper],
})
export class UserModule {}
