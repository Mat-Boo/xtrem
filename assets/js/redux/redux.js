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
const alertMessageSlice = createSlice({
    name: 'alertMessage',
    initialState: '',
    reducers: {
        updateAlertMessage: (state, action) => {
            state = action.payload
            return state
        }
    }
})
export const {updateAlertMessage} = alertMessageSlice.actions;

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

// Slice to stock anwser of modal for change of state
const answerModalForChangeStateSlice = createSlice({
    name: 'answerModalForChangeState',
    initialState: '',
    reducers: {
        updateAnswerModalForChangeState: (state, action) => {
            state = action.payload
            return state
        }
    }
})
export const {updateAnswerModalForChangeState} = answerModalForChangeStateSlice.actions;

// Slice to stock anwser of modal for delete
const answerModalForDeleteSlice = createSlice({
    name: 'answerModalForDelete',
    initialState: '',
    reducers: {
        updateAnswerModalForDelete: (state, action) => {
            state = action.payload
            return state
        }
    }
})
export const {updateAnswerModalForDelete} = answerModalForDeleteSlice.actions;

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
        alertMessage: alertMessageSlice.reducer,
        modal: modalSlice.reducer,
        answerModalForChangeState: answerModalForChangeStateSlice.reducer,
        answerModalForDelete: answerModalForDeleteSlice.reducer,
        typeButton: typeButtonSlice.reducer
    }
})