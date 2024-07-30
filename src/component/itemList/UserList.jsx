import React, { useEffect, useState } from 'react';
import './UserList.css';
import { collection, getDocs, QuerySnapshot } from "firebase/firestore"
import {db} from "../Firebase"
export default function UserList() {
  const [myData,setMyData]=useState([])
  
  const fetchData=async()=>{
    await getDocs(collection(db,"idpass"))
    .then((querySnapshot)=>{
      const newData =querySnapshot.docs
      .map((doc)=>({...doc.data(),id:doc.id}))
      setMyData(newData)
      console.log(myData,newData)
    })
  }
  useEffect(()=>{
   fetchData()
  },[])

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Email Id</th>
            <th>Password</th>
            <th>SignUp Time</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          
            {myData.map((e,i)=>(
              <tr>
                <th>{e.mail}</th>
                <th>{e.pass}</th>
                <th>{e.date}</th>
                <th>{e.ip}</th>
              </tr>
            ))}
          
          
        </tbody>
      </table>
    </div>
  );
}
