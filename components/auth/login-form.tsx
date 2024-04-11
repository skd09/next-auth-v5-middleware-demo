"use client"
import React, { useState } from 'react'
import * as z from "zod"
import { useTransition } from 'react'
import { CardWrapper } from './card-wrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../ui/form"
import { LoginSchema } from '@/schemas'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'
import { login } from '@/actions/login'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export const LoginForm = () => {
    const [showTwoFactor, setShowTwoFactor] = useState(false)
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()

    const searchParams = useSearchParams()
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!" : ""

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("")
        setSuccess("")
        startTransition(() => {
            login(values)
                .then((data) => {
                    if(data.error){
                        form.reset()
                        setError(data.error)
                    }
                    if(data.success){
                        form.reset()
                        setSuccess(data.success)
                    }
                    if(data.twoFactor){
                        setShowTwoFactor(true)
                    }
                })
                .catch(() => "Something went wrong")
        })
    }

    return (
        <CardWrapper
            headerLabel='Welcome Back'
            backButtonLabel="Don't have an account?"
            backButtonHref='/auth/register'
            showSocial
        >
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                >
                    <div className='space-y-4'>
                        { showTwoFactor &&

                            <FormField 
                                name='code'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Two Factor Code</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                placeholder='123456'
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        }
                        { !showTwoFactor &&
                            <>
                                <FormField 
                                    name='email'
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    placeholder='john.smith@gmail.com'
                                                    type='email'
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField 
                                    name='password'
                                    control={form.control}
                                    render={({ field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    placeholder='********'
                                                    type='password'
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <Button size="sm" variant="link" asChild className='px-0 font-normal'>
                                                <Link href="/auth/reset">
                                                    Forgot Password
                                                </Link>
                                            </Button>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </>
                        }
                    </div>
                    <FormError message={error || urlError}/>
                    <FormSuccess message={success}/>
                    <Button 
                        className='w-full'
                        type='submit'
                        disabled={isPending}
                    >
                        { showTwoFactor ?  "Confirm" : "Login" }
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
