import { configureStore, createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: '',
    reducers: {
        updateAuth: (state, action) => {
            state = action.payload
            return state
        }
    }
})

export const {updateAuth} = authSlice.actions;

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    }
})