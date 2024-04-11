/**
 * An array that lists all the routes that are publicly accessible.
 * These routes needs no authentication.
 * @types {string[]}
 */
export const publicRoutes = [
    "/",
    "/auth/new-verification"
]

/**
 * An array that lists all the routes that are used for authetication.
 * These routes will redirect logged in users to /settings.
 * @types {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error"
]

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 * @types {string}
 */
export const apiAuthPrefix = "/api/auth"

/**
 * The default redirect path after the user is logged in.
 * @types {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings"