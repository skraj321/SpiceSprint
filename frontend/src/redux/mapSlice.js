import { createSlice } from "@reduxjs/toolkit";
import { setAddress } from "./userSlice";

const mapSlice = createSlice({
    name:"user",
    initialState:{
        location:{
            lat:null,
            long:null
        },
        address:null
    },
    reducers:{
       setLocation:(state,action)=>{
        const {lat,long} = action.payload
        state.location.lat = lat
        state.location.long = long
       },
       setCurrAddress:(state,action)=>{
        state.address = action.payload
       }
    }
})
export const { setLocation, setCurrAddress } = mapSlice.actions;
export default mapSlice.reducer;