
"use client";

import { Button, Navbar } from "flowbite-react";
import logo from '../assets/logo.webp'
export function NavComp() {
  return (
    <div className="w-full z-50 relative ">
    <Navbar fluid rounded className="">
      <Navbar.Brand>
        <img src={logo} className="mr-3 h-10 w-10 rounded-full sm:h-9" alt="StockYangu Logo" />
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link className="navLink" href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#" className="navLink">About</Navbar.Link>
        <Navbar.Link href="#" className="navLink">Services</Navbar.Link>
        <Navbar.Link href="#" className="navLink">Pricing</Navbar.Link>
        <Navbar.Link href="#" className="navLink">Contact</Navbar.Link>
        <div className="flex gap-4 mx-auto p-4 md:p-0">
        <Button gradientDuoTone="purpleToBlue" outline>Login</Button>
        <Button gradientDuoTone="pinkToOrange" outline>Register</Button>
      </div>
      </Navbar.Collapse>
    </Navbar>
    </div>
  );
}
