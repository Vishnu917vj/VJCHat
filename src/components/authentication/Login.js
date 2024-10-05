import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate=useNavigate();
    const [password,setPassword]=useState("");
    const [email,setEmail]=useState("");
    const handleSubmit=(e)=>{
      e.preventDefault();
        axios.post("/api/users/login",{email,password}).then((response)=>{
          console.log(response.data.user);
            localStorage.setItem("userInfo",JSON.stringify(response.data.user));
            navigate("/chat");
            window.alert("Login successful");
        })
    }
  return (
    <Form onSubmit={handleSubmit}>
     <Form.Group  controlId="formBasicEmail">
      <Form.Label>Email address</Form.Label>
      <Form.Control type="email" placeholder="Enter email" onChange={(e)=>setEmail(e.target.value)} />
    </Form.Group>

    <Form.Group  controlId="formBasicPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
    </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}

export default Login