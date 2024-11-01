import { Prisma, PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    omit: {
      user: {
        password: true,
      },
    },
    log: [
      {
        emit: "stdout",
        level: "error",
      },
    ],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env["NODE_ENV"] !== "production") globalThis.prismaGlobal = prisma;

export async function nullOnNotFound<A>(
  promise: Promise<A>
): Promise<A | null> {
  try {
    return await promise;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return null;
      }
    }
    throw e;
  }
}
