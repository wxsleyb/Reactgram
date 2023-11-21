import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import authService from "../services/authService";


const user = JSON.parse(localStorage.getItem("user"))


const initialState = {
    user: user ? user : null,
    error:false,
    success: false,
    loading: false,
}

// registrar usuario e logar ele

export const register = createAsyncThunk("auth/register", async(user, thunkAPI)=>{
    const data = await authService.register(user)

    // checagem de erro

    if(data.errors){
        return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data;
})

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        reset:(state)=>{
            state.loading=false
            state.error=false
            state.success=false
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(register.pending,(state)=>{
            state.loading= true
            state.error= false
        }).addCase(register.fulfilled, (state,action)=>{
            state.loading=false
            state.success=true
            state.error=null
            state.user=action.payload
        }).addCase(register.rejected, (state,action)=>{
            state.loading=false
            state.error=action.payload
            state.user=null
        })
        .addCase(logout.fulfilled, (state,action)=>{
            state.loading=false
            state.success=true
            state.error=null
            state.user=null
        })
    }
})


//deslogar um usuario

export const logout = createAsyncThunk("auth/logout", async ()=>{
    await authService.logout()
})

export const {reset} = authSlice.actions
export default authSlice.reducer;