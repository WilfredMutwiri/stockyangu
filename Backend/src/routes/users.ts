import { User, UserRole } from "@prisma/client";
import { Response, Router } from "express";
import { ApiResponseType } from "../types/api";
import prisma from "../lib/prisma";

const CURRENT_USER_ID_ALIAS = "me";

const usersRouter = Router();
type UserWithoutPassword = Omit<User, "password">;

usersRouter.get(
  "/",
  async (req, res: Response<ApiResponseType<UserWithoutPassword[]>>) => {
    const { limit, page, offset } = req.pagination;


    // role of the user
    const role = req.user.role;

    if (role === UserRole.SELLER) {
      //  return the user's own profile
      return res.json({
        success: true,
        message: "Succeeded.",
        data: [req.user],
        pagination: {
          current_page: page,
          has_next: false,
          has_prev: false,
          items_count: 1,
          pages_count: 1,
          links: {
            next: null,
            prev: null,
            self: req.originalUrl,
          },
        },
      });
    }

    
    const urlWithoutQuery = req.originalUrl.split("?")[0];

    // if the user is a manager, return all users in the shop
    if (role === UserRole.MANAGER) {
      const usersPromise = prisma.user.findMany({
        where: {
          shopId: req.user.shopId,
        },
        take: limit,
        skip: offset,
      });
      const countPromise = prisma.user.count({
        where: {
          shopId: req.user.shopId,
        },
      });

      const [users, count] = await Promise.all([usersPromise, countPromise]);


      return res.json({
        success: true,
        message: "Succeeded.",
        data: users,
        pagination: {
          current_page: page,
          has_next: offset + limit < count,
          has_prev: offset > 0,
          items_count: count,
          pages_count: Math.ceil(count / limit),
          links: {
            next:
              offset + limit < count
                ? `${urlWithoutQuery}?page=${page + 1}&limit=${limit}`
                : null,
            prev:
              offset > 0
                ? `${urlWithoutQuery}?page=${page - 1}&limit=${limit}`
                : null,
            self: req.originalUrl,
          },
        },
      });
    }

    // if the user is an admin, return all users
    if (role === UserRole.SYS_ADMIN) {
      const usersPromise = prisma.user.findMany({
        take: limit,
        skip: offset,
      });
      const countPromise = prisma.user.count();

      const [users, count] = await Promise.all([usersPromise, countPromise]);

      return res.json({
        success: true,
        message: "Succeeded.",
        data: users,
        pagination: {
          current_page: page,
          has_next: offset + limit < count,
          has_prev: offset > 0,
          items_count: count,
          pages_count: Math.ceil(count / limit),
          links: {
            next:
              offset + limit < count
                ? `${urlWithoutQuery}?page=${page + 1}&limit=${limit}`
                : null,
            prev:
              offset > 0
                ? `${urlWithoutQuery}?page=${page - 1}&limit=${limit}`
                : null,
            self: req.originalUrl,
          },
        },
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid request. (code: N.R)",
      data: [],
    });
  }
);

usersRouter.get(
  "/:id",
  async (req, res: Response<ApiResponseType<Omit<User, "password">, null>>) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Please log out and login again.",
          data: null,
        });
      }

      // return the user with the id if requested by someone with the right permissions
      // or if the loggedin user is the same as the one requesting
      const requestedUserId = req.params.id;
      if (
        requestedUserId === CURRENT_USER_ID_ALIAS ||
        req.user.id === requestedUserId
      ) {
        // check if user is logged in

        return res.json({
          success: true,
          // something friendly to end user
          message: "Succeeded.",
          data: req.user,
        });
      }

      // if requester is a normal user, they can only view their own profile
      if (req.user.role === UserRole.SELLER) {
        return res.status(403).json({
          success: false,
          message:
            "You do not have permission to view the requested information.",
          data: null,
        });
      }

      // if admin
      if (req.user.role === UserRole.SYS_ADMIN) {
        const user = await prisma.user.findUnique({
          where: {
            id: requestedUserId,
          },
        });

        if (user) {
          return res.json({
            success: true,
            message: "Succeeded.",
            data: user,
          });
        }

        return res.status(404).json({
          success: false,
          data: null,
          message: "The requested user was not found on the server.",
        });
      }

      // if manager
      if (req.user.role === UserRole.MANAGER) {
        const user = await prisma.user.findUnique({
          where: {
            id: requestedUserId,
            shopId: req.user.shopId,
          },
          include: {
            shop: true,
          },
        });

        if (user) {
          return res.json({
            success: true,
            message: "Succeeded.",
            data: user,
          });
        }

        return res.status(404).json({
          success: false,
          message: "The requested data was not found.",
          data: null,
        });
      }

      // this user has no role?
      return res.status(400).json({
        success: false,
        message: "Invalid request (code:N.R)",
        data: null,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error.",
        success: false,
        data: null,
      });
    }
  }
);

export default usersRouter;
