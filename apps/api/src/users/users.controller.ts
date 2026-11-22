import { Body, Controller, Get, Post } from "@nestjs/common";
import { createUserSchema, type CreateUserInput } from "@repo/shared";
import { UsersService } from "./users.service.js";

@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  findAll() {
    return this.users.findAll();
  }

  @Post()
  create(@Body({ schema: createUserSchema }) body: CreateUserInput) {
    return this.users.create(body);
  }
}
