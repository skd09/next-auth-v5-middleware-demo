// import "next-auth"

import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    role?: UserRole,
    isTwoFactorEnabled: Boolean
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser
    }
}

// // Declare your framework library
// declare module "next-auth" {
//   /**
//    * The shape of the user object returned in the OAuth providers' `profile` callback,
//    * or the second parameter of the `session` callback, when using a database.
//    */
//   interface User {
//     role: "ADMIN" | "USER"
//   }
//   /**
//    * The shape of the account object returned in the OAuth providers' `account` callback,
//    * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
//    */
//   interface Account {}

//   /**
//    * Returned by `useSession`, `auth`, contains information about the active session.
//    */
//   interface Session {}
// }

// declare module "next-auth/jwt" {
//   /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
//   interface JWT {
//     /** OpenID ID Token */
//     // idToken?: string
//     role?: "ADMIN" | "USER"
//   }
// }