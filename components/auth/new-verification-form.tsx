"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { CardWrapper } from './card-wrapper'
import { BeatLoader } from 'react-spinners'
import { useSearchParams } from 'next/navigation'
import { newVerification } from '@/actions/new-verification'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'

const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const onSubmit = useCallback(() => {
        if(success || error){

        }
        console.log(token)
        if(!token) {
            setError("Missing Token!")
        }
        newVerification(token ?? "")
            .then((data) => {
                setError(data.error)
                setSuccess(data.success)
            })
            .catch(() => {
                setError("Something went wrong!")
            })
    }, [token, success, error])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])

    return (
        <CardWrapper
            headerLabel='Confirming your Verification'
            backButtonHref='/auth/login'
            backButtonLabel='Back to Login'
        >   
            <div className='flex items-center w-full justify-center'>
                {!success && !error && 
                    <BeatLoader />
                }
                <FormSuccess message={success}/>
                { !success && 
                    <FormError message={error}/>
                }
                
            </div>
        </CardWrapper>
    )
}

export default NewVerificationForm