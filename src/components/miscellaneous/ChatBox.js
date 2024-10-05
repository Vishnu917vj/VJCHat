import React from 'react'
import SingleChat from './SingleChat'
import '../styles/ChatBox.css';

function ChatBox({fetchAgain, setFetchAgain}) {
  return (
    <>
    <div className='bg-white p-3 text-center text-dark' style={{marginTop:'10px',height:'100vh'}}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
      </div>
    </>)
}

export default ChatBox