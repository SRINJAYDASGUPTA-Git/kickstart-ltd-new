import React from 'react'
import Image from 'next/image'
import { Montserrat_Alternates } from 'next/font/google'
import { Button } from '../ui/button';

const montserrat_alternates = Montserrat_Alternates({ subsets: ['latin'], weight: '600' });

const Header = () => {
  return (
    <header className='flex flex-row p-2 text-white bg-[#2b2c2c] justify-between place-items-center'>
      <div className='flex flex-row justify-center place-items-center'>
        <Image src="/logo.png" height={100} width={100} alt='logo' />
        <p className={`${montserrat_alternates.className} text-2xl`}>KICKSTART</p>
      </div>
      <div className='flex flex-row gap-5 me-10 text-'>
        <Button className='bg-gradient-to-r from-[#2A86FF] to-[#195099] rounded-2xl'>
          Sign Up
        </Button>
        <Button className='bg-gradient-to-r from-[#2A86FF] to-[#195099] rounded-2xl'>
          Sign Ip
        </Button>
        <Button className='bg-gradient-to-r from-[#2A86FF] to-[#195099] rounded-2xl'>
          Contact Us
        </Button>
      </div>
    </header>
  )
}

export default Header
