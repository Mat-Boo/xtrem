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

// Slice to stock anwser of modal for Reset Access
const answerModalForResetAccessSlice = createSlice({
    name: 'answerModalForResetAccess',
    initialState: '',
    reducers: {
        updateAnswerModalForResetAccess: (state, action) => {
            state = action.payload
            return state
        }
    }
})
export const {updateAnswerModalForResetAccess} = answerModalForResetAccessSlice.actions;

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

// Slice to stock filter's choices
const filterSlice = createSlice({
    name: 'filter',
    initialState: {/* type: '', */ search: '', state: 'all'},
    reducers: {
        updateFilter: (state, action) => {
            state = action.payload
            return state
        }
    }
})
export const {updateFilter} = filterSlice.actions;

// Slice to stock a change of state of partner or club
const stateItemSlice = createSlice({
    name: 'stateItem',
    initialState: '',
    reducers: {
        updateStateItem: (state, action) => {
            state = action.payload
            return state
        }
    }
})
export const {updateStateItem} = stateItemSlice.actions;

// Slice to stock the response of axios
const axiosAnswerSlice = createSlice({
    name: 'axiosAnswer',
    initialState: '',
    reducers: {
        updateAxiosAnswer: (state, action) => {
            state = action.payload
            return state
        }
    }
})
export const {updateAxiosAnswer} = axiosAnswerSlice.actions;

// Slice to stock the loader
const loaderSlice = createSlice({
    name: 'loader',
    initialState: true,
    reducers: {
        updateLoader: (state, action) => {
            state = action.payload
            return state
        }
    }
})
export const {updateLoader} = loaderSlice.actions;

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        alertMessage: alertMessageSlice.reducer,
        modal: modalSlice.reducer,
        answerModalForChangeState: answerModalForChangeStateSlice.reducer,
        answerModalForDelete: answerModalForDeleteSlice.reducer,
        answerModalForResetAccess: answerModalForResetAccessSlice.reducer,
        typeButton: typeButtonSlice.reducer,
        filter: filterSlice.reducer,
        stateItem: stateItemSlice.reducer,
        axiosAnswer: axiosAnswerSlice.reducer,
        loader: loaderSlice.reducer
    }
})