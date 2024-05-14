import React from 'react'
import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => {
  return (
    <div className='w-full h-[100vh] bg-[#111315] flex items-center justify-center'>
        <SignUp fallbackRedirectUrl={'/onboarding'} />
    </div>
  )
}

export default SignUpPage