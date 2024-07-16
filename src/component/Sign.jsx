import React, { useState } from 'react'
import "./Sign.css"
import {Link ,useNavigate} from 'react-router-dom'
import { auth } from './Firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'


export default function Sign() {
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
    createUserWithEmailAndPassword(auth,email,password).then(data=>{
      console.log(auth,'athenhdb')
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
        <h1 className='myTitle'>Sign up</h1>
        <label className='userDetail'>
        Email:  
        <input  type='email' placeholder='Enter your email' onChange={emailHandle} value={email} required></input>
        </label>
        <label className='userDetail'>
         Password:   
        <input  type='password' placeholder='enter your password' onChange={emailPassword} value={password}  required></input>
        </label>
        <button type='submit'>Sign Up</button>
        <p>Already Registered? <Link to="/login">logIn</Link></p>
      </form>
      
    </div>
  )
}