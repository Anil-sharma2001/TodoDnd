import React, { useState } from 'react'
import "./Sign.css"
import {Link,useNavigate } from 'react-router-dom'
import { auth } from './Firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'


export default function Login() {
   const [email , setEmail]=useState('')
   const [password , setPassword] =useState('')

   const nevigate =useNavigate()

   const emailHandle =(e)=>{
    setEmail(e.target.value)
   }
   const emailPassword =(e)=>{
    setPassword(e.target.value)
   }
   const handleSubmit =(e)=>{
    e.preventDefault()
    signInWithEmailAndPassword(auth,email,password).then(data=>{
      console.log(auth,"authData")
      nevigate('/todo')
    }).catch(err=>{
      alert(err.code)
    })
   setEmail('')
   setPassword('')
   }
  
  
    
     return (
       <div className='container'>
         <form className='form-sign' onSubmit={handleSubmit}>
           <h1 className='myTitle'>LogIn</h1>
           <label className='userDetail'>
           Email:  
           <input  type='email' placeholder='Enter your email' onChange={emailHandle} value={email} required></input>
           </label>
           <label className='userDetail'>
            Password:   
           <input  type='password' placeholder='enter your password' onChange={emailPassword} value={password}  required></input>
           </label>
           <button type='submit'>LogIn</button>
           <p>Want to Registered? <Link to="/">Sign In</Link></p>
         </form>
         
       </div>
     )
   }
   
   
