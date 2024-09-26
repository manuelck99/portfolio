import {
  clearKyselyDb,
  createKyselyDb,
  DB,
  destroyKyselyDb,
  migratePostgresContainer,
  startPostgresContainer,
  stopPostgresContainer,
} from "@pf/db"
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql"
import { Kysely } from "kysely"
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  NotFoundException,
} from "@nestjs/common"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { AppModule } from "../app.module"
import { DB_CONNECTION } from "../db/db-connection.provider"
import { CatchAllExceptionFilter } from "../exception/catch-all-exception.filter"
import { CreateUserDto, UserDto } from "@pf/dto"
import { DateTime } from "luxon"

const prefix = "api"

const testUser = {
  first_name: "Alessandra",
  last_name: "Zouch",
  email: "azouch1@devhub.com",
  phone_number: "449-166-7229",
  birth_date: "2023-12-04",
  street_address: "940 Laurel Way",
  zip_code: "165155",
  city: "Vel’sk",
  country: "Russia",
}

describe("[DB] User", () => {
  let container: StartedPostgreSqlContainer
  let db: Kysely<DB>
  let app: INestApplication
  beforeAll(async () => {
    container = await startPostgresContainer()
    await migratePostgresContainer(container)

    db = createKyselyDb(container)

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DB_CONNECTION)
      .useValue(db)
      .compile()
    app = moduleRef.createNestApplication({ logger: false })
    app.setGlobalPrefix(prefix)
    app.useGlobalFilters(new CatchAllExceptionFilter())
    await app.init()
  })
  beforeEach(async () => {
    await clearKyselyDb(db)
  })
  afterAll(async () => {
    await app.close()
    await destroyKyselyDb(db)
    await stopPostgresContainer(container)
  })
  test("GET /user/:ID with existing ID should be successful", async () => {
    const selectUser = await db
      .insertInto("user")
      .values(testUser)
      .returning([
        "id",
        "first_name",
        "last_name",
        "email",
        "birth_date",
        "phone_number",
        "street_address",
        "zip_code",
        "city",
        "country",
      ])
      .executeTakeFirstOrThrow()

    const response = await request(app.getHttpServer()).get(
      `/${prefix}/user/${selectUser.id}`,
    )
    expect(response.status).toStrictEqual(HttpStatus.OK)
    expect(response.ok).toStrictEqual(true)
    expect(response.error).toStrictEqual(false)
    expect(response.body).toBeDefined()
    expect(response.body).not.toBeNull()

    const userDto: UserDto = response.body
    expect(userDto).toStrictEqual({
      id: selectUser.id,
      firstName: selectUser.first_name,
      lastName: selectUser.last_name,
      email: selectUser.email,
      birthDate: DateTime.fromJSDate(selectUser.birth_date).toISODate(),
      phoneNumber: selectUser.phone_number,
      streetAddress: selectUser.street_address,
      zipCode: selectUser.zip_code,
      city: selectUser.city,
      country: selectUser.country,
    })
  })
  test("GET /user/:ID with non-existing ID should be unsuccessful", async () => {
    const id = "22cbb8d9-5604-4956-9674-4bcffb68b084"
    const response = await request(app.getHttpServer()).get(
      `/${prefix}/user/${id}`,
    )
    expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND)
    expect(response.notFound).toStrictEqual(true)
    expect(response.error).toBeDefined()
    expect(response.error).not.toBeNull()
    expect(response.body).toHaveProperty("name", NotFoundException.name)
    expect(response.body).toHaveProperty("statusCode", HttpStatus.NOT_FOUND)
    expect(response.body).toHaveProperty(
      "message",
      `User with ID ${id} couldn't be found`,
    )
  })
  test("POST /user with valid data should be successful", async () => {
    const response = await request(app.getHttpServer())
      .post(`/${prefix}/user`)
      .send({
        firstName: testUser.first_name,
        lastName: testUser.last_name,
        email: testUser.email,
        birthDate: testUser.birth_date,
        phoneNumber: testUser.phone_number,
        streetAddress: testUser.street_address,
        zipCode: testUser.zip_code,
        city: testUser.city,
        country: testUser.country,
      } as CreateUserDto)
    expect(response.status).toStrictEqual(HttpStatus.CREATED)
    expect(response.error).toStrictEqual(false)
    expect(response.body).toBeDefined()
    expect(response.body).not.toBeNull()

    const userDto: UserDto = response.body
    const selectUser = await db
      .selectFrom("user")
      .select([
        "id",
        "first_name",
        "last_name",
        "email",
        "birth_date",
        "phone_number",
        "street_address",
        "zip_code",
        "city",
        "country",
      ])
      .where("user.id", "=", userDto.id)
      .executeTakeFirstOrThrow()

    expect(userDto.firstName).toStrictEqual(testUser.first_name)
    expect(userDto.lastName).toStrictEqual(testUser.last_name)
    expect(userDto.email).toStrictEqual(testUser.email)
    expect(userDto.birthDate).toStrictEqual(testUser.birth_date)
    expect(userDto.phoneNumber).toStrictEqual(testUser.phone_number)
    expect(userDto.streetAddress).toStrictEqual(testUser.street_address)
    expect(userDto.zipCode).toStrictEqual(testUser.zip_code)
    expect(userDto.city).toStrictEqual(testUser.city)
    expect(userDto.country).toStrictEqual(testUser.country)

    expect(userDto.id).toStrictEqual(selectUser.id)
    expect(userDto.firstName).toStrictEqual(selectUser.first_name)
    expect(userDto.lastName).toStrictEqual(selectUser.last_name)
    expect(userDto.email).toStrictEqual(selectUser.email)
    expect(userDto.birthDate).toStrictEqual(
      DateTime.fromJSDate(selectUser.birth_date).toISODate(),
    )
    expect(userDto.phoneNumber).toStrictEqual(selectUser.phone_number)
    expect(userDto.streetAddress).toStrictEqual(selectUser.street_address)
    expect(userDto.zipCode).toStrictEqual(selectUser.zip_code)
    expect(userDto.city).toStrictEqual(selectUser.city)
    expect(userDto.country).toStrictEqual(selectUser.country)
  })
  test("POST /user with missing first name should be unsuccessful", async () => {
    const response = await request(app.getHttpServer())
      .post(`/${prefix}/user`)
      .send({
        lastName: testUser.last_name,
        email: testUser.email,
        birthDate: testUser.birth_date,
        phoneNumber: testUser.phone_number,
        streetAddress: testUser.street_address,
        zipCode: testUser.zip_code,
        city: testUser.city,
        country: testUser.country,
      } as Partial<CreateUserDto>)
    expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST)
    expect(response.badRequest).toStrictEqual(true)
    expect(response.error).toBeDefined()
    expect(response.error).not.toBeNull()
    expect(response.body).toHaveProperty("name", BadRequestException.name)
    expect(response.body).toHaveProperty("statusCode", HttpStatus.BAD_REQUEST)
    expect(response.body).toHaveProperty("message", "Validation failed")
    expect(response.body).toHaveProperty("cause.name", "ZodError")
    expect(response.body).toHaveProperty("cause.issues[0].code", "invalid_type")
    expect(response.body).toHaveProperty("cause.issues[0].path[0]", "firstName")
  })
  test("POST /user with first name too short should be unsuccessful", async () => {
    const response = await request(app.getHttpServer())
      .post(`/${prefix}/user`)
      .send({
        firstName: "",
        lastName: testUser.last_name,
        email: testUser.email,
        birthDate: testUser.birth_date,
        phoneNumber: testUser.phone_number,
        streetAddress: testUser.street_address,
        zipCode: testUser.zip_code,
        city: testUser.city,
        country: testUser.country,
      } as Partial<CreateUserDto>)
    expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST)
    expect(response.badRequest).toStrictEqual(true)
    expect(response.error).toBeDefined()
    expect(response.error).not.toBeNull()
    expect(response.body).toHaveProperty("name", BadRequestException.name)
    expect(response.body).toHaveProperty("statusCode", HttpStatus.BAD_REQUEST)
    expect(response.body).toHaveProperty("message", "Validation failed")
    expect(response.body).toHaveProperty("cause.name", "ZodError")
    expect(response.body).toHaveProperty("cause.issues[0].code", "too_small")
    expect(response.body).toHaveProperty("cause.issues[0].path[0]", "firstName")
  })
  test("POST /user with first name too long should be unsuccessful", async () => {
    const response = await request(app.getHttpServer())
      .post(`/${prefix}/user`)
      .send({
        firstName: "F".repeat(51),
        lastName: testUser.last_name,
        email: testUser.email,
        birthDate: testUser.birth_date,
        phoneNumber: testUser.phone_number,
        streetAddress: testUser.street_address,
        zipCode: testUser.zip_code,
        city: testUser.city,
        country: testUser.country,
      } as Partial<CreateUserDto>)
    expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST)
    expect(response.badRequest).toStrictEqual(true)
    expect(response.error).toBeDefined()
    expect(response.error).not.toBeNull()
    expect(response.body).toHaveProperty("name", BadRequestException.name)
    expect(response.body).toHaveProperty("statusCode", HttpStatus.BAD_REQUEST)
    expect(response.body).toHaveProperty("message", "Validation failed")
    expect(response.body).toHaveProperty("cause.name", "ZodError")
    expect(response.body).toHaveProperty("cause.issues[0].code", "too_big")
    expect(response.body).toHaveProperty("cause.issues[0].path[0]", "firstName")
  })
  test("POST /user with missing last name should be unsuccessful", async () => {
    const response = await request(app.getHttpServer())
      .post(`/${prefix}/user`)
      .send({
        firstName: testUser.first_name,
        email: testUser.email,
        birthDate: testUser.birth_date,
        phoneNumber: testUser.phone_number,
        streetAddress: testUser.street_address,
        zipCode: testUser.zip_code,
        city: testUser.city,
        country: testUser.country,
      } as Partial<CreateUserDto>)
    expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST)
    expect(response.badRequest).toStrictEqual(true)
    expect(response.error).toBeDefined()
    expect(response.error).not.toBeNull()
    expect(response.body).toHaveProperty("name", BadRequestException.name)
    expect(response.body).toHaveProperty("statusCode", HttpStatus.BAD_REQUEST)
    expect(response.body).toHaveProperty("message", "Validation failed")
    expect(response.body).toHaveProperty("cause.name", "ZodError")
    expect(response.body).toHaveProperty("cause.issues[0].code", "invalid_type")
    expect(response.body).toHaveProperty("cause.issues[0].path[0]", "lastName")
  })
  test("POST /user with last name too short should be unsuccessful", async () => {
    const response = await request(app.getHttpServer())
      .post(`/${prefix}/user`)
      .send({
        firstName: testUser.first_name,
        lastName: "",
        email: testUser.email,
        birthDate: testUser.birth_date,
        phoneNumber: testUser.phone_number,
        streetAddress: testUser.street_address,
        zipCode: testUser.zip_code,
        city: testUser.city,
        country: testUser.country,
      } as Partial<CreateUserDto>)
    expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST)
    expect(response.badRequest).toStrictEqual(true)
    expect(response.error).toBeDefined()
    expect(response.error).not.toBeNull()
    expect(response.body).toHaveProperty("name", BadRequestException.name)
    expect(response.body).toHaveProperty("statusCode", HttpStatus.BAD_REQUEST)
    expect(response.body).toHaveProperty("message", "Validation failed")
    expect(response.body).toHaveProperty("cause.name", "ZodError")
    expect(response.body).toHaveProperty("cause.issues[0].code", "too_small")
    expect(response.body).toHaveProperty("cause.issues[0].path[0]", "lastName")
  })
  test("POST /user with last name too long should be unsuccessful", async () => {
    const response = await request(app.getHttpServer())
      .post(`/${prefix}/user`)
      .send({
        firstName: testUser.first_name,
        lastName: "F".repeat(51),
        email: testUser.email,
        birthDate: testUser.birth_date,
        phoneNumber: testUser.phone_number,
        streetAddress: testUser.street_address,
        zipCode: testUser.zip_code,
        city: testUser.city,
        country: testUser.country,
      } as Partial<CreateUserDto>)
    expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST)
    expect(response.badRequest).toStrictEqual(true)
    expect(response.error).toBeDefined()
    expect(response.error).not.toBeNull()
    expect(response.body).toHaveProperty("name", BadRequestException.name)
    expect(response.body).toHaveProperty("statusCode", HttpStatus.BAD_REQUEST)
    expect(response.body).toHaveProperty("message", "Validation failed")
    expect(response.body).toHaveProperty("cause.name", "ZodError")
    expect(response.body).toHaveProperty("cause.issues[0].code", "too_big")
    expect(response.body).toHaveProperty("cause.issues[0].path[0]", "lastName")
  })
  test("POST /user with missing email should be unsuccessful", async () => {
    const response = await request(app.getHttpServer())
      .post(`/${prefix}/user`)
      .send({
        firstName: testUser.first_name,
        lastName: testUser.last_name,
        birthDate: testUser.birth_date,
        phoneNumber: testUser.phone_number,
        streetAddress: testUser.street_address,
        zipCode: testUser.zip_code,
        city: testUser.city,
        country: testUser.country,
      } as Partial<CreateUserDto>)
    expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST)
    expect(response.badRequest).toStrictEqual(true)
    expect(response.error).toBeDefined()
    expect(response.error).not.toBeNull()
    expect(response.body).toHaveProperty("name", BadRequestException.name)
    expect(response.body).toHaveProperty("statusCode", HttpStatus.BAD_REQUEST)
    expect(response.body).toHaveProperty("message", "Validation failed")
    expect(response.body).toHaveProperty("cause.name", "ZodError")
    expect(response.body).toHaveProperty("cause.issues[0].code", "invalid_type")
    expect(response.body).toHaveProperty("cause.issues[0].path[0]", "email")
  })
  test("POST /user with invalid email should be unsuccessful", async () => {
    const response = await request(app.getHttpServer())
      .post(`/${prefix}/user`)
      .send({
        firstName: testUser.first_name,
        lastName: testUser.last_name,
        email: "test.com",
        birthDate: testUser.birth_date,
        phoneNumber: testUser.phone_number,
        streetAddress: testUser.street_address,
        zipCode: testUser.zip_code,
        city: testUser.city,
        country: testUser.country,
      } as Partial<CreateUserDto>)
    expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST)
    expect(response.badRequest).toStrictEqual(true)
    expect(response.error).toBeDefined()
    expect(response.error).not.toBeNull()
    expect(response.body).toHaveProperty("name", BadRequestException.name)
    expect(response.body).toHaveProperty("statusCode", HttpStatus.BAD_REQUEST)
    expect(response.body).toHaveProperty("message", "Validation failed")
    expect(response.body).toHaveProperty("cause.name", "ZodError")
    expect(response.body).toHaveProperty(
      "cause.issues[0].code",
      "invalid_string",
    )
    expect(response.body).toHaveProperty("cause.issues[0].path[0]", "email")
  })
  test("DELETE /user/:ID with existing ID should be successful", async () => {
    const selectUser = await db
      .insertInto("user")
      .values(testUser)
      .returning([
        "id",
        "first_name",
        "last_name",
        "email",
        "birth_date",
        "phone_number",
        "street_address",
        "zip_code",
        "city",
        "country",
      ])
      .executeTakeFirstOrThrow()

    const response = await request(app.getHttpServer()).delete(
      `/${prefix}/user/${selectUser.id}`,
    )
    expect(response.status).toStrictEqual(HttpStatus.NO_CONTENT)
    expect(response.noContent).toStrictEqual(true)
    expect(response.error).toStrictEqual(false)
  })
  test("DELETE /user/:ID with non-existing ID should be unsuccessful", async () => {
    const id = "22cbb8d9-5604-4956-9674-4bcffb68b084"
    const response = await request(app.getHttpServer()).delete(
      `/${prefix}/user/${id}`,
    )
    expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND)
    expect(response.notFound).toStrictEqual(true)
    expect(response.error).toBeDefined()
    expect(response.error).not.toBeNull()
    expect(response.body).toHaveProperty("name", NotFoundException.name)
    expect(response.body).toHaveProperty("statusCode", HttpStatus.NOT_FOUND)
    expect(response.body).toHaveProperty(
      "message",
      `User with ID ${id} couldn't be deleted`,
    )
  })
})
