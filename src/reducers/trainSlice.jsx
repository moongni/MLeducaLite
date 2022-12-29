import { createSlice } from "@reduxjs/toolkit";
import { getDtype, getShape } from "../components/Common/module/getData";

const initialState = {
    feature: {
        data: {},
        columns: [],
        shape: [],
        dtype: {}
    },
    label: {
        data: {},
        columns: [],
        shape: [],
        dtype: {}
    }
}

const trainSlice = createSlice({
    name: "train",
    initialState,

    reducers: {
        setLabelData(state, action){
            state.label.data = action.payload;
            state.label.columns = Object.keys(action.payload);
            state.label.dtype = getDtype(action.payload);
            state.label.shape = getShape(action.payload);
        },
        setLabels(state, action){
            state.label.columns = action.payload;
        },
        setFeatureData(state, action) {
            state.feature.data = action.payload;
            state.feature.columns = Object.keys(action.payload);
            state.feature.dtype = getDtype(action.payload);
            state.feature.shape = getShape(action.payload);
        },  
        setFeatures(state, action){
            state.feature.columns = action.payload;
        },
        setData(state, action){
            const { title, data } = action.payload;
            const dtype = getDtype(data);
            const shape = getShape(data);

            if (title == "label") {
                state.label.data = data;
                state.label.columns = Object.keys(data);
                state.label.dtype = dtype;
                state.label.shape = shape;
            } else if (title == "feature") {
                state.feature.data = data;
                state.feature.columns = Object.keys(data);
                state.feature.dtype = dtype;
                state.feature.shape = shape;
            }
        },
        initialize(state, action){
            state.feature = {
                data: {},
                columns: [],
                shape: [],
                dtype: {}
            }
            state.label = {
                data: {},
                columns: [],
                shape: [],
                dtype: {}
            }
        }
    }
})

export const trainActions = trainSlice.actions;
export default trainSlice;