import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SignInPage = () => {
  return (
    <div className='w-full h-[100vh] bg-[#111315] flex items-center justify-center'>
        <SignIn  fallbackRedirectUrl={'/onboarding'} />
    </div>  
  )
}

export default SignInPage