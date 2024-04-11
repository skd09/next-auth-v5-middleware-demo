"use client"
import RoleGate from '@/components/auth/role-gate'
import { FormSuccess } from '@/components/form-success'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useCurrentRole } from '@/hooks/use-current-role'
import React from 'react'
import { UserRole } from "@prisma/client"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { admin } from '@/actions/admin'

const AdminPage = () => {
  const onAPIRouteClick = () => {
    fetch("/api/admin")
      .then((response) => {
        if(response.ok){
          toast.success("Allowed API Access!")
        }else{
          toast.error("Forbidden API Access!")
        }
      })
  }

  const onServerActionClick = () => {
    admin()
      .then((response) => {
        if(response.success){
          toast.success("Allowed API Access!")
        }else{
          toast.error("Forbidden API Access!")
        }
      })
  }

  return (
    <Card className='w-[600px]'>
      <CardHeader>
        <p className='text-2xl font-semibold text-center'>
          Admin
        </p>
      </CardHeader>
      <CardContent className='space-y-4'>
          <RoleGate allowedRole={UserRole.ADMIN}>
            <FormSuccess message='You are allowed to see this content!'/>
          </RoleGate>
          <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md'>
            <p>
              Admin-only API Route
            </p>
            <Button onClick={onAPIRouteClick}>
              Click to test
            </Button>
          </div>
          <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md'>
            <p>
              Admin-only Server Action
            </p>
            <Button onClick={onServerActionClick}>
              Click to test
            </Button>
          </div>
      </CardContent>
    </Card>
  )
}

export default AdminPage