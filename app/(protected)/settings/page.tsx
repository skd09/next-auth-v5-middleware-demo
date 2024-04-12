"use client"

import { settings } from "@/actions/settings"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrentUser } from "@/hooks/use-current-user"
import { SettingsSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { UserRole } from "@prisma/client"
import { Switch } from "@/components/ui/switch"


const SettingsPage = () => {
    const { update } = useSession()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const user = useCurrentUser()

    console.log(user)

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        startTransition(() => {
            settings(values)
                .then((data) => { 
                    if(data.error){
                        setError(data.error)
                    }
                    if(data.success){
                        update() 
                        setSuccess(data.success)
                    }
                })
                .catch(() => { setError("Something went wrong") })
        })
    }

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues:{
            name: user?.name || undefined,
            email: user?.email || undefined,
            role: user?.role || undefined,
            password: undefined,
            newPassword: undefined,
            // isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
        }
    })

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Settings
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="space-y-4">
                            <FormField 
                                control={form.control}
                                name= "name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                placeholder="Sharvari D"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            { user?.isOAuth && (
                                <>
                                    <FormField 
                                        control={form.control}
                                        name= "email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        {...field}
                                                        placeholder="Sharvari@gmail.com"
                                                        disabled={isPending}
                                                        type="email"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField 
                                        control={form.control}
                                        name= "password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        {...field}
                                                        placeholder="****"
                                                        disabled={isPending}
                                                        type="password"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField 
                                        control={form.control}
                                        name= "newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        {...field}
                                                        placeholder="****"
                                                        disabled={isPending}
                                                        type="password"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                            
                            
                            <FormField 
                                control={form.control}
                                name= "role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select
                                            disabled={isPending}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={UserRole.ADMIN}>ADMIN</SelectItem>
                                                <SelectItem value={UserRole.USER}>USER</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            { user?.isOAuth &&
                                <FormField 
                                    control={form.control}
                                    name= "isTwoFactorEnabled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-rows items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Two Factor Authentication</FormLabel>
                                                <FormDescription>Enable two factor authemtication from your account</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    disabled={isPending}
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            }
                        </div>
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button type="submit">
                            Save
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default SettingsPage


// const SettingsPage = async () => {
//     const session = await auth()

//     return (
//         <div>
//             {JSON.stringify(session)}
//             <form action={async() => {
//                     "use server"
//                     await signOut()
//                 }}>
//                 <button type='submit'>
//                     SignOut
//                 </button>
//             </form>
//         </div>
//     )
// }