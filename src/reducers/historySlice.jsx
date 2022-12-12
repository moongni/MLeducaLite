import { createSlice } from '@reduxjs/toolkit'

const initialState = { info: {} };

const historySlice = createSlice({
    name: 'history',
    initialState, // 빈 배열
    
    // reducers -> 상태 업데이트 함수 모음
    reducers: {
        setHist( state, action ) {
            if ( typeof action.payload == "string" ) {
                state.info = JSON.parse(action.payload);
            } else {
                state.info = action.payload;
            }
        },
        initialize( state, action ) {
            state.info = {};
        }
    },
});

export const historyActions = historySlice.actions;

export default historySlice;