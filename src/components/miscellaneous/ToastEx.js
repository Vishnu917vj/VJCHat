import React from 'react'
import Toast from 'react-bootstrap/Toast';

function ToastEx(props) {
  return (
    <Toast className='bg-danger'>
    <Toast.Header>
    <i className="fas fa-info-circle"></i> 
    </Toast.Header>
    <Toast.Body>{props.msg}</Toast.Body>
  </Toast>
  )
}

export default ToastEx