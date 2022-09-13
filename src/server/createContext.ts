// src/server/router/context.ts
import { verify } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { verifyJwt } from "../utils/jwt";
import { prisma } from "../utils/prisma";

interface CtxUser {
  id: string;
  email: string;
  name: string;
  iat: string;
  exp: number;
}

function getUserFromRequest(req: NextApiRequest) {
  const token = req.cookies.token;

  if (token) {
    try {
      const verified = verifyJwt<CtxUser>(token);
      return verified;
    } catch (e) {
      return null;
    }
  }
  return null;
}

export function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const user = getUserFromRequest(req);

  return { req, res, prisma, user };
}

export type Context = ReturnType<typeof createContext>;

// import {
//   Session,
//   unstable_getServerSession as getServerSession,
// } from "next-auth";
// import { authOptions as nextAuthOptions } from "../pages/api/auth/[...nextauth]";
// import { prisma } from "./db/client";
// import * as trpc from "@trpc/server";
// import * as trpcNext from "@trpc/server/adapters/next";

// type CreateContextOptions = {
//   session: Session | null;
// };

// /** Use this helper for:
//  * - testing, where we dont have to Mock Next.js' req/res
//  * - trpc's `createSSGHelpers` where we don't have req/res
//  **/
// export const createContextInner = async (opts: CreateContextOptions) => {
//   return {
//     session: opts.session,
//     prisma,
//   };
// };

// /**
//  * This is the actual context you'll use in your router
//  * @link https://trpc.io/docs/context
//  **/
// export const createContext = async (
//   opts: trpcNext.CreateNextContextOptions,
// ) => {
//   const session = await getServerSession(opts.req, opts.res, nextAuthOptions);

//   return await createContextInner({
//     session,
//   });
// };

// type Context = trpc.inferAsyncReturnType<typeof createContext>;

// export const createRouter = () => trpc.router<Context>();
