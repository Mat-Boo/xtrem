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

// Slice to stock infos for modal
const modalSlice = createSlice({
    name: 'modal',
    initialState: '',
    reducers: {
        updateModal: (state, action) => {
            state = action.payload
            return state
        }
    }
})
export const {updateModal} = modalSlice.actions;

// Slice to stock anwser of modal
const answerModalSlice = createSlice({
    name: 'answerModal',
    initialState: '',
    reducers: {
        updateAnswerModal: (state, action) => {
            state = action.payload
            return state
        }
    }
})
export const {updateAnswerModal} = answerModalSlice.actions;

// Slice to stock type of button
const typeButtonSlice = createSlice({
    name: 'typeButton',
    initialState: '',
    reducers: {
        updateTypeButton: (state, action) => {
            state = action.payload
            return state
        }
    }
})
export const {updateTypeButton} = typeButtonSlice.actions;

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        message: messageSlice.reducer,
        modal: modalSlice.reducer,
        answerModal: answerModalSlice.reducer,
        typeButton: typeButtonSlice.reducer
    }
})