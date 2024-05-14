import React from 'react'
import Image from 'next/image'
import { Button } from '../ui/button';
import Link from 'next/link';

const Header = () => {
  return (
    <header className='flex flex-row p-2 text-white bg-[#191616]/25 backdrop-blur-md  justify-between place-items-center rounded-xl w-full z-10 fixed '>

      <Link href={'/'} className='flex justify-center place-items-center'>
        <Image src="/logo.svg" height={65} width={65} alt='logo' />
        <p className={`font-montserrat font-bold text-2xl`}>KICKSTART</p>
      </Link>
      <div className='flex flex-row gap-5 me-10 text-'>
        <Link href={'/sign-up'}>
        <Button className='bg-gradient-to-r from-[#2A86FF] to-[#195099] rounded-full hover:scale-105 font-semibold transition transform ease-in-out duration-300'>
          Sign Up
        </Button>
        </Link>
        <Link href={'/sign-in'}>
        <Button className='bg-gradient-to-r from-[#2A86FF] to-[#195099] rounded-full hover:scale-105 font-semibold transition transform ease-in-out duration-300'>
          Sign Ip
        </Button>
        </Link>
        <Link href={'/contact'}>
        <Button className='bg-gradient-to-r from-[#2A86FF] to-[#195099] rounded-full hover:scale-105 font-semibold transition transform ease-in-out duration-300'>
          Contact Us
        </Button>
        </Link>
      </div>
    </header>
  )
}

export default Header
