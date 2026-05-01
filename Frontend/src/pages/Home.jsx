import React from 'react'
import SideBar from '../components/SideBar'
import MessageArea from '../components/MessageArea'
import getMessages from '../customHooks/getMessages';
import { useSelector } from 'react-redux';

function Home() {
  let {selectedUser} = useSelector((state) => state.user)
  getMessages();
  return (
    <div className='w-full h-[100vh]   flex overflow-hidden'>
      <SideBar />
      <MessageArea />
    </div>
  )
}

export default Home
