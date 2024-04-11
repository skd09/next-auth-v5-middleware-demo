"use client"
import { logout } from '@/actions/logout'
import { useSession, signOut } from 'next-auth/react'
import React from 'react'
import { useCurrentUser } from '@/hooks/use-current-user'

const SettingsPage = () => {
    const session = useSession()
    const user = useCurrentUser()

    const onClick = () => {
        // signOut()
        logout()
    }

    return (
        <div className='bg-white p-10 rounded-xl'>
            <button type='submit' onClick={onClick}>
                SignOut
            </button>
        </div>
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