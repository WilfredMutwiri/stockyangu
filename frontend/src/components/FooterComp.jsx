"use client";
import React from 'react'
import { Footer } from "flowbite-react";
import logoImg from '../assets/logo.webp'
export default function FooterComp() {
  return (
    <div className='border-t-2 border-cyan-600 rounded-md '>
        <Footer container className='bg-slate-100'>
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <Footer.Brand
            src={logoImg}
            className='w-14 md:w-24 h-14 mb-2 md:mb-0 md:h-24 rounded-full'
            alt="stockYangu logo"
            name="StockYangu"
          />
          <Footer.LinkGroup>
            <Footer.Link href="#">About</Footer.Link>
            <Footer.Link href="#">Privacy Policy</Footer.Link>
            <Footer.Link href="#">Services</Footer.Link>
            <Footer.Link href="#">Pricing</Footer.Link>
            <Footer.Link href="#">Contact</Footer.Link>
          </Footer.LinkGroup>
        </div>
        <Footer.Divider />
        <Footer.Copyright href="#" by="StockYangu™" year={new Date().getFullYear()} />
      </div>
    </Footer>
    </div>
  )
}
