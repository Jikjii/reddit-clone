import Image from 'next/image'
import React from 'react'
import { BeakerIcon, ChevronDownIcon, HomeIcon, SearchIcon, MenuIcon } from '@heroicons/react/solid'
import {
    BellIcon,
    ChatIcon,
    GlobeIcon,
    PlusIcon,
    SparklesIcon,
    SpeakerphoneIcon,
    VideoCameraIcon,
} from '@heroicons/react/outline'
import { signIn, signOut, useSession } from 'next-auth/react'


function Header() {
    // this allows us to pull data from the users token
    // once they are logged in via Reddit - - > next-auth provider
    const { data: session } = useSession()

  return (
    <div className="sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm">
        <div className="relative h-10 w-20 flex-shrink-0 cursor-pointer">
            {/* this fits the image in a fitted container  */}
            <Image objectFit="contain" src="https://links.papareact.com/fqy" layout="fill" />
        </div>

        <div className="flex items-center mx-7 xl:min-w-[300px]">
            <HomeIcon className='h-5 w-5' />
            <p className="flex-1 ml-2 hidden lg:inline">Home</p>
            <ChevronDownIcon className='h-5 w-5' />
        </div>
        {/* search box */}
        <form className="flex flex-1 items-center space-x-2 border border-gray-200 rounded-sm bg-gray-100 px-3 py-1">
            <SearchIcon className=" h-6 w-6 text-gray-400"/>
            <input className="flex-1 bg-transparent outline-none" type="text" placeholder="Search Reddit"></input>
            {/* hidden button - just click enter after inputing search */}
            <button type="submit" hidden />
        </form>
        {/* first time using tialwind css global layering below */}
        <div className="text-gray-500 space-x-2 items-center mx-5 hidden lg:inline-flex">
            <SparklesIcon className="icon" />
            <GlobeIcon className="icon" />
            <VideoCameraIcon className="icon" />
            <hr className="h-10 border-gray-100"/>
            <ChatIcon className="icon" />
            <BellIcon className="icon" />
            <PlusIcon className="icon" />
            <SpeakerphoneIcon className="icon" />
        </div>
        <div  className="ml-5 flex items-center lg:hidden">
            <MenuIcon className="icon" />  
        </div>

        {/* sign in sign out */}
        {/*  using a turnary operation to let the client side know whethere
            the user is signed in or signed out - - > will give a different text out or in */}
        {session ? (
            <div onClick={() => signOut()} className="hidden lg:flex items-center space-x-2 cursor-pointer border-gray-100 p-2 border">
                <div className="relative h-5 w-5 flex-shrink-0">
                    <Image objectFit="contain" src="https://links.papareact.com/23l" layout="fill" alt="" />   
                </div>
                <p className="text-gray-400">Sign Out</p>
            </div>
        
        ): (
            <div onClick={() => signIn()} className="hidden lg:flex items-center space-x-2 cursor-pointer border-gray-100 p-2 border">
                <div className="relative h-5 w-5 flex-shrink-0">
                    <Image objectFit="contain" src="https://links.papareact.com/23l" layout="fill" alt="" />   
                </div>
                <p className="text-gray-400">Sign in</p>
            </div>
        )}
        
    
    </div>
  )
}

export default Header