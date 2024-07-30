import React, { useEffect, useState } from "react";
import "./Sign.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./Firebase";
import axios from 'axios'

export default function Sign() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ipData,setIpData]=useState("")

  const getData = async ()=>{
    const res = await axios.get("https://api.ipify.org/?format=json");
    console.log(res.data);
    setIpData(res.data.ip)
    console.log(ipData)
  }
  useEffect(()=>{
    getData()
  },[])

  const emailHandle = (e) => {
    setEmail(e.target.value);
  };

  const emailPassword = (e) => {
    setPassword(e.target.value);
  };
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const time = today.getHours();
  const minute = today.getMinutes();
  const currentDate =
    month + "/" + date + "/" + year + "--" + time + ":" + minute;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valRef = collection(db, "idpass");
    await addDoc(valRef, { mail: email, pass: password, date: currentDate ,
      ip:ipData
    });
    createUserWithEmailAndPassword(auth, email, password)
      .then((data) => {
        console.log(auth, "athenhdb");
        alert("Successfully created");
      })
      .catch((err) => {
        alert(err.code);
      });

    setEmail("");
    setPassword("");
  };

  return (
    <div className="container">
      <form className="form-sign" onSubmit={handleSubmit}>
        <h1 className="myTitle">Sign up</h1>
        <label className="userDetail">
          Email:
          <input
            type="email"
            placeholder="Enter your email"
            onChange={emailHandle}
            value={email}
            required
          ></input>
        </label>
        <label className="userDetail">
          Password:
          <input
            type="password"
            placeholder="enter your password"
            onChange={emailPassword}
            value={password}
            required
          ></input>
        </label>
        <button type="submit">Sign Up</button>
        <p>
          Already Registered? <Link to="/login">logIn</Link>
        </p>
      </form>
    </div>
  );
}
