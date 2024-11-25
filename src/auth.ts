import NextAuth, { type User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { NextRequest } from "next/server"
import type { GetServerSidePropsContext } from "next"
import api from "./utils/api"

type LoginResponse = {
  data: {
    access_token: string
    user: {
      id: number
      userType: string
      email: string
      active: boolean
      createdAt: string
      updatedAt: string
    }
  }
}
 
export const getAuthOptions = (
  req?: NextRequest | GetServerSidePropsContext['req'],
) => {
  const host = req?.headers?.host ?? req?.headers?.get?.('host');
  const protocol = !host?.includes('local') ? 'https' : 'http';
  
  process.env.NEXTAUTH_URL = `${protocol}://${host}/api/auth`;

  return {
    pages: {
      signIn: '/login',
    },
    session: {
      maxAge: 7 * 24 * 60 * 60, // 7 dias em segundos
    },
    providers: [
      Credentials({
        credentials: {
          email: {},
          password: {},
        },
        authorize: async (credentials) => {
          const loginResponse = await api.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          }) as LoginResponse

          if (!loginResponse?.data?.user) {
            throw new Error("Credenciais inválidas.")
          }

          const user = loginResponse.data.user;
          return {
            id: user.id.toString(),
            userType: user.userType,
            email: user.email,
            active: user.active,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            access_token: loginResponse.data.access_token
          }
        },
      }),
    ],
    callbacks: {
      session: ({ session, token }) => {
        return {
          ...session,
          user: {
            id: token.id,
            userType: token.userType,
            email: token.email,
            active: token.active,
            createdAt: token.createdAt,
            updatedAt: token.updatedAt,
            access_token: token.access_token
          } as User
        }
      },
      jwt: ({ token, user }) => {
        if (user) {
          return {
            ...token,
            id: user.id,
            userType: user.userType,
            email: user.email,
            active: user.active,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            access_token: user.access_token
          }
        }
        return token
      }
    }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth(getAuthOptions)

declare module "next-auth" {
  interface Session {
    user: User
  }

  interface User {
    userType: string
    active: boolean
    createdAt: string
    updatedAt: string
    access_token: string
  }
}