import React, { useRef, useState, useEffect } from 'react' 
import dp from '../assets/dp.png'
import { IoIosCamera } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverURL } from '../main';
import { setUserData } from '../redux/userSlice';

function Profile() {
  let { userData } = useSelector((state) => state.user)
  let dispatch = useDispatch()
  let navigate = useNavigate()

  let [name, setName] = useState(userData?.name || "")
  let [frontImage, setFrontImage] = useState(userData?.image || dp)
  let [backendImage, setBackendImage] = useState(null)

  let image = useRef()
  let [saving, setSaving] = useState(false)

  // ✅ FIX: localStorage se data wapas Redux me daalo (refresh ke baad)
  useEffect(() => {
    if (!userData) {
      let storedData = localStorage.getItem("userData");
      if (storedData) {
        dispatch(setUserData(JSON.parse(storedData)));
      }
    }
  }, []);

  const handleImage = (e) => {
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontImage(URL.createObjectURL(file))
  }

  const handleProfile = async (e) => {
    setSaving(true)
    e.preventDefault()

    try {
      let formData = new FormData()
      formData.append("name", name)

      if (backendImage) {
        formData.append("image", backendImage)
      }

      let result = await axios.put(
        `${serverURL}/api/user/profile`,
        formData,
        { withCredentials: true }
      )

      setSaving(false)

      dispatch(setUserData(result.data))
      localStorage.setItem("userData", JSON.stringify(result.data))

      
       // 🔥 REDIRECT TO HOME
    navigate("/")

    } catch (error) {
      setSaving(false)
      console.log(error)
    }
  }

  // image sync
  useEffect(() => {
    if (userData?.image) {
      setFrontImage(userData.image)
    }
  }, [userData])

  // name sync
  useEffect(() => {
    if (userData?.username) {
      setName(userData.username)
    }
  }, [userData])

  if (!userData) return <div>Loading...</div>

  return (
    <div className='w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center gap-[20px]'>

      <div className='fixed top-[20px] left-[20px] cursor-pointer' onClick={() => navigate("/")}>
        <IoMdArrowBack className='w-[50px] h-[50px] text-gray-600' />
      </div>

      <div
        className='bg-white rounded-full border-4 border-[#20c7ff] shadow-gray-400 shadow-lg relative'
        onClick={() => image.current.click()}
      >
        <div className='w-[200px] h-[200px] rounded-full overflow-hidden flex justify-center items-center'>
          <img src={frontImage} alt="" className='h-[100%]' />
        </div>
        <div className='absolute bottom-4 right-4 w-[35px] h-[35px] text-gray-700 rounded-full bg-[#20c7ff] flex justify-center items-center shadow-gray-300 shadow-lg'>
          <IoIosCamera className='w-[25px] h-[25px]' />
        </div>
      </div>

      <form
        className='w-[95%] max-w-[500px] flex flex-col gap-[20px] items-center justify-center'
        onSubmit={handleProfile}
      >

        <input
          className='hidden'
          type="file"
          accept='image/*'
          ref={image}
          onChange={handleImage}
        />

        <input
          type="text"
          placeholder="Enter your name"
          className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-[white] rounded-lg shadow-gray-200 shadow-lg text-gray-700 text-[19px]'
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <input
          type="text"
          readOnly
          value={userData?.username || ""}
          className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-[white] rounded-lg shadow-gray-200 shadow-lg text-gray-400 text-[19px]'
        />

        <input
          type="email"
          readOnly
          value={userData?.email || ""}
          className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-[white] rounded-lg shadow-gray-200 shadow-lg text-gray-400 text-[19px]'
        />

        <button
          className='px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg text-[20px] w-[200px] mt-[20px] font-semibold hover:shadow-inner'
          disabled={saving}
        >
          {saving ? "saving.." : "save profile"}
        </button>

      </form>
    </div>
  )
}

export default Profile