import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpass, setConfirmpass] = useState("");
    const [email, setEmail] = useState("");
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = (e) => {
        
        e.preventDefault(); // Prevent page reload on form submit
        if(!name || !email || !password || !confirmpass){
            window.alert("Please fill all the fields");
        }
        if (password !== confirmpass) {
            window.alert("Passwords do not match");
            return;
        }
        // Create user object
        const user = {
            name,
            email,
            password,
            pic
        };

        // Add user to database
        axios.post("/api/users", user)
            .then((response) => {
                window.alert("Registered successfully");
                console.log(response.data);
                localStorage.setItem("userInfo", JSON.stringify(response.data));
                navigate("/chat");
            })
            .catch((error) => {
                window.alert(error.response.data.message);
            });


    }

    // Handle image upload to Cloudinary
    const post = (pic) => {
        setLoading(true);
        if (!pic) {
            window.alert("Please select a valid image");
            setLoading(false);
            return;
        }

        // Check if the file type is an image
        if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "vjChat"); // Change this to your actual preset name
            data.append("cloud_name", "degkuikdy"); // Change this to your actual cloud name

            // Make the fetch request to Cloudinary
            fetch("https://api.cloudinary.com/v1_1/degkuikdy/image/upload", {
                method: "POST",
                body: data
            })
            .then(response => response.json())
            .then(data => {
                setPic(data.url.toString()); // Save the image URL in state
                setLoading(false);
                console.log(data.url.toString()); // Log the uploaded image URL
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
        } else {
            window.alert("Please select an image file (jpeg or png)");
            setLoading(false);
        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="John Doe"
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formBasicConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setConfirmpass(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formBasicPhoto">
                    <Form.Label>Upload your photo</Form.Label>
                    <Form.Control
                        type="file"
                        placeholder="image.png"
                        onChange={(e) => post(e.target.files[0])}
                    />
                </Form.Group>
                <Button
                    className="mx-5"
                    variant="primary"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Uploading..." : "Submit"}
                </Button>
            </Form>
        </div>
    );
}

export default Signin;
