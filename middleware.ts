import { auth } from "./auth"
import { apiAuthPrefix, publicRoutes, authRoutes, DEFAULT_LOGIN_REDIRECT } from "./schemas/routes"

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isApiRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoutes = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoutes = authRoutes.includes(nextUrl.pathname)

    if(isApiRoute){ return }

    if(isAuthRoutes){
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return
    }

    if(!isLoggedIn && !isPublicRoutes){
        return Response.redirect(new URL("/auth/login", nextUrl))
    } 

    return   
})

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}