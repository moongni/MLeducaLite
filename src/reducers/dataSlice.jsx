import { createSlice } from "@reduxjs/toolkit";
import { getDtype, getShape } from "../components/Common/module/getData";

const initialState = {
    columns: [],
    data: {},
    shape: [],
    dtype: {}
}

const dataSlice = createSlice({
    name: 'data',
    initialState,

    reducers: {
        addData(state, action) {
            state.data = {
                ...state.data,
                ...action.payload
            };
            state.dtype = getDtype(state.data);
            state.shape = getShape(state.data);
        },
        setData(state, action) {
            state.data = action.payload;
            state.columns = Object.keys(state.data);
            state.dtype = getDtype(action.payload);
            state.shape = getShape(action.payload);
        },
        setColumns(state, action){
            state.columns = action.payload;
        },
        // addData(state,action) {
        //     const { columns , samples } = action.payload;
        //     state.columns = columns;
        //     state.data = samples;
        // },
        initialize(state, action){
            state.columns = []
            state.data = {}
        }
    }
})

export const dataActions = dataSlice.actions;
export default dataSlice;