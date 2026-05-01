import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { serverURL } from "../main"
import { useDispatch, useSelector } from 'react-redux'
import dp from '../assets/dp.png'
import { IoSearch } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import { setOtherUsers, setSelectedUser, setUserData, setSearchData } from '../redux/userSlice';

function SideBar() {
  let { userData, otherUsers, selectedUser, onlineusers, searchData } = useSelector((state) => state.user)

  let [search, setSearch] = useState(false)
  let [input, setInput] = useState("")
  let [debouncedInput, setDebouncedInput] = useState("")

  let dispatch = useDispatch()
  let navigate = useNavigate()

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverURL}/api/auth/logout`, {
        withCredentials: true,
      });

      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      localStorage.removeItem("userData");

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(input)
    }, 500)

    return () => clearTimeout(timer)
  }, [input])

  // ✅ search API
  const handlesearch = async (query) => {
    try {
      let result = await axios.get(
        `${serverURL}/api/user/search?query=${query}`,
        { withCredentials: true }
      )
      dispatch(setSearchData(result.data))
    } catch (error) {
      console.log(error)
    }
  }

  // ✅ call API
  useEffect(() => {
    if (debouncedInput.trim()) {
      handlesearch(debouncedInput)
    } else {
      dispatch(setSearchData([]))
    }
  }, [debouncedInput])

  return (
    <div className={`lg:w-[30%] w-full h-full lg:block bg-slate-200 ${!selectedUser ? "block" : "hidden"}`}>

      {/* logout */}
      <div
        className='w-[60px] h-[60px] rounded-full mt-[10px] flex justify-center items-center cursor-pointer bg-[#20c7ff] shadow-lg fixed bottom-[20px] left-[10px]'
        onClick={handleLogOut}
      >
        <RiLogoutCircleLine className='w-[25px] h-[25px]' />
      </div>

      {/* top */}
      <div className='w-full h-[300px] bg-[#20c7ff] rounded-b-[30%] shadow-lg flex flex-col justify-center px-[20px]'>

        <h1 className='text-white font-bold text-[25px]'>chatly</h1>

        <div className='flex justify-between items-center'>
          <h1 className='text-gray-800 font-bold text-[25px]'>
            Hii, {userData?.username || "User"}
          </h1>

          <div
            className='w-[60px] h-[60px] rounded-full overflow-hidden bg-white shadow-lg cursor-pointer'
            onClick={() => navigate("/profile")}
          >
            <img src={userData?.image || dp} alt="" className='w-full h-full object-cover' />
          </div>
        </div>

        {/* search */}
        <div className='w-full flex items-center gap-[20px] py-[15px]'>

          {!search && (
            <div
              className='w-[60px] h-[60px] flex justify-center items-center bg-white rounded-full shadow-lg cursor-pointer'
              onClick={() => setSearch(true)}
            >
              <IoSearch className='w-[25px] h-[25px]' />
            </div>
          )}

          {search && (
            <div className='w-full relative'>

              {/* input */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className='w-full h-[60px] bg-white shadow-lg flex items-center gap-[10px] rounded-full px-[20px]'
              >
                <IoSearch className='w-[25px] h-[25px]' />

                <input
                  type="text"
                  placeholder='Search users...'
                  className='w-full h-full outline-none border-0'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />

                <RxCross2
                  className='w-[25px] h-[25px] cursor-pointer'
                  onClick={() => {
                    setSearch(false)
                    setInput("")
                    dispatch(setSearchData([]))
                  }}
                />
              </form>

              {/* ✅ SEARCH RESULTS UI IMPROVED */}
              {searchData?.length > 0 && (
                <div className='absolute top-[70px] left-0 w-full max-h-[300px] bg-white overflow-y-auto z-50 rounded-xl shadow-lg flex flex-col gap-[10px] py-[10px]'>

                  {searchData.map((user) => (
                    <div
                      key={user._id}
                      className='w-[95%] mx-auto h-[70px] flex items-center gap-[20px] px-[15px] 
                      border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:bg-[#b2ccdf] cursor-pointer transition'
                      onClick={() => {
                        dispatch(setSelectedUser(user))
                        setInput("")
                        setSearch(false)
                      }}
                    >

                      <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
                        <img src={user.image || dp} alt="" className='w-full h-full object-cover' />
                      </div>

                      <h1 className='text-gray-800 font-semibold'>
                        {user.username}
                      </h1>

                    </div>
                  ))}

                </div>
              )}

            </div>
          )}

          {/* online users top */}
          {!search && otherUsers?.map((user) => (
            onlineusers?.includes(user._id) && (
              <div
                key={user._id}
                className='relative flex justify-center items-center mt-[10px] cursor-pointer'
                onClick={() => dispatch(setSelectedUser(user))}
              >
                <div className='w-[60px] h-[60px] rounded-full overflow-hidden'>
                  <img src={user.image || dp} alt="" className='w-full h-full object-cover' />
                </div>

                <span className='w-[12px] h-[12px] bg-[#3aff20] rounded-full absolute bottom-[6px] right-[-1px]'></span>
              </div>
            )
          ))}

        </div>
      </div>

      {/* user list */}
      <div className='w-full h-[50%] overflow-auto flex flex-col gap-[20px] items-center mt-[20px]'>

        {otherUsers?.map((user) => (
          <div
            key={user._id}
            className='w-[95%] h-[70px] flex items-center gap-[20px] bg-white shadow-lg rounded-full hover:bg-[#b2ccdf] cursor-pointer'
            onClick={() => dispatch(setSelectedUser(user))}
          >

            <div className='relative'>
              <div className='w-[60px] h-[60px] rounded-full overflow-hidden'>
                <img src={user.image || dp} alt="" className='w-full h-full object-cover' />
              </div>

              {onlineusers?.includes(user._id) && (
                <span className='w-[12px] h-[12px] bg-[#3aff20] rounded-full absolute bottom-[6px] right-[-1px]'></span>
              )}
            </div>

            <h1 className='text-gray-800 font-semibold text-[20px]'>
              {user.username}
            </h1>

          </div>
        ))}

      </div>

    </div>
  )
}

export default SideBar