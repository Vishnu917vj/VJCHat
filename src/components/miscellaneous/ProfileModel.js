import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ChatState } from '../../context/chatProvider';
import axios from 'axios';
import ToastEx from './ToastEx';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Form from 'react-bootstrap/Form';

function ProfileModel() {
    const { user,setUser} = ChatState();
    const [username, setUsername] = useState("");
    const [pic, setPic] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(false);
    const [msg, setMsg] = useState("");
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChangePic = async (e) => {
        e.preventDefault();
        if (pic !== "") {
            setLoading(true);
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.post("/api/users/updateprofilepic", { pic }, config);
                setLoading(false);
                window.alert("Profile pic changed");
                setUser({ ...user, pic: data.profilePicture });
                localStorage.setItem("userInfo", JSON.stringify(user));
                window.location.reload();
            } catch (err) {
                setLoading(false);
                setMsg(err.response?.data?.message || "An error occurred");
                setToast(true);
                setTimeout(() => setToast(false), 3000);
            }
        }
    };

    const handleChangeUserName = async (e) => {
        e.preventDefault();
        if (username !== "") {
            setLoading(true);
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.post("/api/users/updateusername", { name: username }, config);
                setLoading(false);
                window.alert("Username changed");
                setUser({ ...user, username: data.username ,name:username});
                localStorage.setItem("userInfo", JSON.stringify(user));
                window.location.reload();
            } catch (err) {
                setLoading(false);
                setMsg(err.response?.data?.message || "An error occurred");
                setToast(true);
                setTimeout(() => setToast(false), 3000);
            }
        } else {
            setToast(true);
            setMsg("Username cannot be empty");
            setTimeout(() => setToast(false), 3000);
        }
    };

    const post = async (pic) => {
        setLoading(true);
        if (!pic) {
            window.alert("Please select a valid image");
            setLoading(false);
            return;
        }

        if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "vjChat");
            data.append("cloud_name", "degkuikdy");

            try {
                const response = await fetch("https://api.cloudinary.com/v1_1/degkuikdy/image/upload", {
                    method: "POST",
                    body: data,
                });
                const result = await response.json();
                setPic(result.url.toString());
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
                window.alert("Error uploading image");
            }
        } else {
            window.alert("Please select an image file (jpeg or png)");
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                View Profile
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{user.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img className="img-fluid" style={{ objectFit: 'contain', width: '250px', height: '250px' }} src={user.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} alt="Profile" />
                </Modal.Body>
                <Modal.Footer>
                    <Form>
                        <div>
                            <Form.Group controlId="exampleForm.ControlInput123">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="John Doe"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Group>
                            <Button type="button" onClick={handleChangeUserName} disabled={loading}>
                                Change Username
                            </Button>
                        </div>
                        <div>
                        <Form.Group controlId="formBasicPhoto123">
    <Form.Label>Upload your photo</Form.Label>
    <input
        type="file"
        placeholder="image.png"
        onChange={(e) => post(e.target.files[0])}
        onClick={() => (console.log("clicked"))}
        style={{ display: 'block' }} // Ensure it's displayed 
    />
</Form.Group>

                            <Button type="button" onClick={handleChangePic} disabled={loading}>
                                Change Profile Pic
                            </Button>
                        </div>
                    </Form>
                    <div>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
            {toast && <ToastEx message={msg} />}
        </>
    );
}

export default ProfileModel;
