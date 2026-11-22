import { ConflictException, Injectable } from "@nestjs/common";
import type { CreateUserInput } from "@repo/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { Prisma, User } from "@repo/database";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({ orderBy: { id: "asc" } });
  }

  async create(data: CreateUserInput): Promise<User> {
    try {
      return await this.prisma.user.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException("Email already in use");
      }
      throw error;
    }
  }
}
