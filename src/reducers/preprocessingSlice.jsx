import { createSlice } from '@reduxjs/toolkit'
import { isEmpty } from '../components/Common/module/checkEmpty';
import { selectColumn } from '../components/Common/module/package';

const initialState = { 
    train: {
        label: {},
        feature: {}
    },
    test: {
        label: {},
        feature: {}
    }
};

const preprocessingSlice = createSlice({
    name: 'preprocess',
    initialState, // 빈 배열
    
    // reducers -> 상태 업데이트 함수 모음
    reducers: {
        setProcess(state, action) {
            const { column, preprocess, kind, title } = action.payload; 
            
            if (!isEmpty(column) && !isEmpty(preprocess)){
                state[kind][title] = {
                    ...state[kind][title],
                    [column]: preprocess
                }
            }
        },
        loadProcess(state, action) {
            state = action.payload;
        },
        initOne(state, action) {
            const { title, initName } = action.payload;
            
            if ( initName == "label" || initName == "feature") {
                state[title] = {
                    ...state[title],
                    [initName]: {}
                }
            }
        },
        initTrainFeature(state, action) {
            state.train = {
                ...state.train,
                ["feature"]: {}
            }
        },
        initialize(state, action) {
            state.train = {
                label: {},
                feature: {}
            };
            state.test = {
                label: {},
                feature: {}
            };
        },
        updateProcess(state, action) {
            const { title, columns, kind } = action.payload;
            state[kind][title] = selectColumn(state[kind][title], columns)
        },
    },
});

export const preprocessingActions = preprocessingSlice.actions;

export default preprocessingSlice;