import React from 'react'
import dp from "../assets/dp.png"
import { useRef } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
function SenderMessage({image, message}) {
  let scroll=useRef()
  let {userData}=useSelector((state)=>state.user)
    useEffect(()=>{
    scroll.current?.scrollIntoView({behavior:"smooth"})
  },[message,image])

  const hsndleImageScroll=()=>{
  scroll.current?.scrollIntoView({behavior:"smooth"})
}
  
  return (
    <div className='flex items-start gap-[10px]'>
       
        <div ref={scroll} className='w-fit max-w-[500px] px-[20px] py-[10px] bg-[#20c7ff]
     text-white text-[19px] rounded-tr-none rounded-2xl shadow-lg flex
      flex-col gap-[10px]'>
          {image &&  <img src={image} alt="" className='w-[150px] rounded-lg' onLoad={hsndleImageScroll} />}
      {message && <span >{message}</span>}
        </div>
      <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex bg-white
                   justify-center items-center shadow-gray-500 shadow-lg cursor-pointer'
                   onClick={() => navigate("/profile")}
                 >
                   <img src={userData?.image || dp} alt="" className='h-[100%]' />
                 </div> 
    </div>
  )
}

export default SenderMessage
