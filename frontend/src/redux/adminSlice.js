import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name:"admin",
    initialState:{
        shopData: null,
    },
    reducers:{
        setShopData: (state,action) =>{
            state.shopData = action.payload;
        },

    }
})
export const { setShopData } = adminSlice.actions;
export default adminSlice.reducer;