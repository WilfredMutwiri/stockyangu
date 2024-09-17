import React from 'react'
import logo from '../assets/signup.jpg'
import { Button, Spinner, TextInput } from 'flowbite-react'
import { useState } from 'react'
export default function SignUp() {
    const [loading,setLoading]=useState(false);
    const [showPassword,setShowpassword]=useState(false);
    const handleSubmit=(e)=>{
        e.preventDefault();
        setLoading(true);
    }
  return (
    <div>
        <div className='w-11/12 mx-auto block md:flex flex-row pt-10 pb-10 gap-16'>
        <div className='flex-1 text-center'>
            <h2 className='text-xl md:text-3xl font-bold'>Welcome to <strong className='text-gray-800'>Stock<span className='text-green-400'>Yangu</span></strong></h2>
            <h3 className='text-xl md:text-2xl font-semibold pt-2'>Let's get you started</h3>
            <img src={logo} className='mx-auto w-44 md:w-80 h-44 md:h-80' alt='logo Image'/>  
        </div>
        <div className='flex-1 flex flex-col gap-5 pt-5'>
            <h2 className='font-semibold text-center md:text-left'>Create Your Account!</h2>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <TextInput
            placeholder='Your Email Address'
            type='email'
            className=''
            required/>
            <TextInput
            placeholder='Your Username'
            type='text'
            className=''
            required/>
            <TextInput
            placeholder='Your Password'
            type={showPassword?'text':'password'}
            className=''
            required/>
            <div className=''>
                <input
                type='checkbox'
                onChange={()=>setShowpassword(!showPassword)}
                id='passwordBox'
                checked={showPassword}
                className='rounded-sm'/>
                <span className='p-2 text-sm'>Show Password</span>
            </div>
            <Button gradientDuoTone='pinkToOrange' className='w-full' outline disabled={loading} type='submit'>
                {
                    loading?(
                        <span>
                        <Spinner size='sm'/><span className='text-sm pl-2'>Loading...</span>
                        </span>
                    ):'Register'
                }
            </Button>
            </form>
            <p className='text-sm text-center'>Already have an account?<a className='text-green-600 pl-1' href='/signin'>Login</a></p>
        </div>
        </div>
    </div>
  )
}
