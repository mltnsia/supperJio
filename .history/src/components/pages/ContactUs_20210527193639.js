import React, { useState } from "react"
import { db } from '../../firebase.js'
import NavBar from '../layout/NavBar.js'

export default function ContactUs() {
    const [name, setName] = use
    return (
        <div>
        <NavBar></NavBar>
        
        <form className="form">
            <h1>Contact Us Here!</h1>

            <label>Name</label>
            <input placeholder="name" />

            <label>Email</label>
            <input placeholder="Email" />

            <label>Message</label>
            <textarea placeholder="Message"></textarea>

            <button type="submit">Submit</button>
            
        </form>
        </div>
    );
}