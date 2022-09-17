import { configureStore, createSlice } from '@reduxjs/toolkit'

// Slice to stock User's infos when he's connected
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

// Slice to stock message for success and error
const messageSlice = createSlice({
    name: 'message',
    initialState: '',
    reducers: {
        updateMessage: (state, action) => {
            state = action.payload
            return state
        }
    }
})

export const {updateMessage} = messageSlice.actions;

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        message: messageSlice.reducer
    }
})