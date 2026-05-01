import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        otherUsers:null,
        selectedUser:null,
        onlineusers:null,
        searchData:null
},
    reducers:{
        setUserData:(state,action)=>{
            state.userData=action.payload
        },
        setOtherUsers:(state,action)=>{
            state.otherUsers=action.payload
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser=action.payload
        },
        setOnlineUsers:(state,action)=>{
            state.onlineusers=action.payload
        },setSearchData:(state,action)=>{
            state.searchData =action.payload
        }
    }

});

export const {setUserData, setOtherUsers, setSelectedUser,  setOnlineUsers, setSearchData}=userSlice.actions;
export default userSlice.reducer;