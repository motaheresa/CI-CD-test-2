import { ConflictException } from "@nestjs/common";
import { Prisma, type User } from "@repo/database";
import { describe, expect, it, vi } from "vitest";
import type { PrismaService } from "../prisma/prisma.service.js";
import { UsersService } from "./users.service.js";

function createService(create: ReturnType<typeof vi.fn>) {
  const prisma = { user: { create } } as unknown as PrismaService;
  return new UsersService(prisma);
}

const input = { email: "a@test.com", name: "A" };

describe("UsersService.create", () => {
  it("returns the created user", async () => {
    const user: User = {
      id: 1,
      email: input.email,
      name: input.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const create = vi.fn().mockResolvedValue(user);

    await expect(createService(create).create(input)).resolves.toBe(user);
    expect(create).toHaveBeenCalledWith({ data: input });
  });

  it("maps a unique-constraint error (P2002) to 409 Conflict", async () => {
    const error = new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
      code: "P2002",
      clientVersion: "test",
    });
    const create = vi.fn().mockRejectedValue(error);

    const result = await createService(create)
      .create(input)
      .catch((e: unknown) => e);

    expect(result).toBeInstanceOf(ConflictException);
    expect((result as ConflictException).getStatus()).toBe(409);
  });

  it("rethrows other Prisma errors unchanged", async () => {
    const error = new Prisma.PrismaClientKnownRequestError("Foreign key failed", {
      code: "P2003",
      clientVersion: "test",
    });
    const create = vi.fn().mockRejectedValue(error);

    await expect(createService(create).create(input)).rejects.toBe(error);
  });

  it("rethrows unknown errors unchanged", async () => {
    const error = new Error("db down");
    const create = vi.fn().mockRejectedValue(error);

    await expect(createService(create).create(input)).rejects.toBe(error);
  });
});
