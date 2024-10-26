import { UserRole } from "@prisma/client";
import prisma from "./src/lib/prisma";

// const requestedUserId = "some-user";
const requesterId = "requester-user";

export async function playground() {
  // const shop = await prisma.shop.create({
  //   data: {
  //     name: "shop",
  //     category: "BEAUTY",
  //     email: "example@jj",
  //     phone: "1234567890",
  //   },
  // });

  // console.log(`Created shop:`, shop);

  // // Create requested user
  // const requestedUser = await prisma.user.create({
  //   data: {
  //     email: "ex@ff.cc",
  //     name: "Requested User",
  //     role: UserRole.SELLER,
  //     shopId: shop.id,
  //     password: "password",
  //   },
  // });

  // console.log(`Created requested user:`, requestedUser);

  // // Create requester
  // const requester = await prisma.user.create({
  //   data: {
  //     email: "exa@dd.cc",
  //     name: "Requester",
  //     role: UserRole.MANAGER,
  //     shopId: shop.id,
  //     password: "password",
  //   },
  // });

  // console.log(`Created requester:`, requester);

  // Check if requester is a manager at the shop where the requested user works

  const shop = await prisma.shop.findFirst({
    include: {
      workers: true,
    },
  });
  console.log(`Found shop:`, shop);
  const user = await prisma.user.findFirst({
    where: {
      // id: requestedUserId,
      shop: {
        workers: {
          some: {
            id: requesterId,
            role: UserRole.MANAGER,
          },
        },
      },
    },
  });

  console.log(`Was able to find user:`, user);
}
