import React, { useState } from 'react'
import logo from '../assets/login.jpg'
import { Button, Spinner, TextInput } from 'flowbite-react'
import { Link } from 'react-router-dom';
export default function SignIn() {
    const [showPassword,setShowpassword]=useState(false);
    const [loading,setLoading]=useState(false);
    const handleSubmit=(e)=>{
        e.preventDefault();
        setLoading(true);
    }
  return (
    <div>
        <div className='w-10/12 mx-auto block md:flex flex-row pt-10 pb-10 gap-16'>
        <div className='flex-1 text-center'>
            <h2 className='text-2xl md:text-3xl font-bold text-green-400'>Welcome Back!</h2>
            <h3 className='text-xl md:text-2xl font-semibold pt-2'>Continue keeping your business on track!</h3>
            <img src={logo} className='mx-auto w-44 md:w-80 h-44 md:h-80' alt='logo Image'/>  
        </div>
        <div className='flex-1 flex flex-col gap-4 pt-5'>
            <h2 className='font-semibold text-center md:text-left'>Login</h2>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <TextInput
            placeholder='Your Email'
            type='email'
            className=''
            required/>
            <TextInput
            placeholder='Your Password'
            type={showPassword?'text':'password'}
            className=''
            required/>
            <div>
                <input
                type='checkbox'
                checked={showPassword}
                onChange={()=>setShowpassword(!showPassword)}
                className='rounded-sm'/>
                <span className='p-2 text-sm my-auto'>Show Password</span>
            </div>
            <Button gradientDuoTone='pinkToOrange' className='w-full mx-auto' outline type='submit' disabled={loading}>
                {
                    loading?(
                        <span>
                        <Spinner size='sm'/>
                        <span className='pl-2'>Loading...</span>
                        </span>
                    ):'Login'
                }
            </Button>
            </form>
            <p className='text-sm text-center'>Don’t have an account?<Link to="/signup" className='text-green-600 pl-1'>create account.</Link></p>
        </div>
        </div>
    </div>
  )
}
