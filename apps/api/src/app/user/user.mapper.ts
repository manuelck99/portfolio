import { Injectable } from "@nestjs/common"
import { InsertUser, SelectUser } from "@pf/db"
import { CreateUserDto, UserDto } from "@pf/dto"
import { DateTime } from "luxon"

@Injectable()
export class UserMapper {
  selectUserToUserDto(selectUser: SelectUser): UserDto {
    const birthDate = DateTime.fromJSDate(
      selectUser.birth_date,
    ).toISODate() as string

    return {
      id: selectUser.id,
      firstName: selectUser.first_name,
      lastName: selectUser.last_name,
      email: selectUser.email,
      birthDate,
      phoneNumber: selectUser.phone_number,
      streetAddress: selectUser.street_address,
      zipCode: selectUser.zip_code,
      city: selectUser.city,
      country: selectUser.country,
    }
  }

  createUserDtoToInsertUser(createUserDto: CreateUserDto): InsertUser {
    return {
      first_name: createUserDto.firstName,
      last_name: createUserDto.lastName,
      email: createUserDto.email,
      birth_date: createUserDto.birthDate,
      phone_number: createUserDto.phoneNumber,
      street_address: createUserDto.streetAddress,
      zip_code: createUserDto.zipCode,
      city: createUserDto.city,
      country: createUserDto.country,
    }
  }
}
