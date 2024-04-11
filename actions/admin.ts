"use server"
import { currentRole } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import { error } from "console"

export const admin = async () => {
    const role = await currentRole()
    console.log(role)
    if(role !== UserRole.ADMIN){
        return { error: "Forbidden!"}
    }
    return { success: "Allowed!" }
}