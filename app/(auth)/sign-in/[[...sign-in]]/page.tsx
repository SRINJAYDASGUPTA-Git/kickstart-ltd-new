import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SignInPage = () => {
  return (
    <div className='w-full h-[100vh] flex items-center justify-center'>
        <SignIn fallbackRedirectUrl={'/onboarding'} />
    </div>  
  )
}

export default SignInPage