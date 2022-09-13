import { createRouter } from "../createRouter";
import {
  createUserOutputSchema,
  createUserSchema,
  requestOtpInput,
  requestOtpSchema,
  verifyOtpSchema,
} from "../../schema/user.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";
import { isError } from "react-query";
import { baseUrl } from "../../constants";
import { encode, decode } from "../../utils/base64";
import { sendLoginEmail } from "../../utils/mailer";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { signJwt } from "../../utils/jwt";
import { serialize } from "cookie";
export const userRouter = createRouter()
  .mutation("register-user", {
    input: createUserSchema,
    async resolve({ ctx, input }) {
      const { email, name } = input;
      try {
        const user = await ctx.prisma.user.create({
          data: {
            email,
            name,
          },
        });
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .mutation("request-otp", {
    input: requestOtpSchema,
    async resolve({ ctx, input }) {
      const { email, redirect } = input;

      const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const token = await ctx.prisma.loginToken.create({
        data: {
          redirect,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      await sendLoginEmail({
        token: encode(`${token.id}:${user.email}`),
        url: baseUrl,
        email: user.email!,
      });
      /// I added a notnull assertion here, that Tom doesn't have.
      // still not sure why TS thinks that email could sometimes be null,
      // or rather how Tom addresses this.
      return true;
    },
  })
  .query("verify-otp", {
    input: verifyOtpSchema,
    async resolve({ input, ctx }) {
      const decoded = decode(input.hash).split(":");
      const [id, email] = decoded;
      const token = await ctx.prisma.loginToken.findFirst({
        where: {
          id,
          user: {
            email,
          },
        },
        include: {
          user: true,
        },
      });

      if (!token) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "invalid token",
        });
      }
      const jwt = signJwt({
        email: token.user.email,
        id: token.user.id,
      });

      ctx.res.setHeader("Set-Cookie", serialize("token", jwt, { path: "/" }));

      return {
        redirect: token.redirect,
      };
    },
  });
