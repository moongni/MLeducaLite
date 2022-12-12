import { createSlice } from "@reduxjs/toolkit";


const initialState = { 
    layer: {
        info: [],
        isModel: false,
        _lastIdx: 0
    },

    parameter: {
        info: {}
    },

    compile: {
        optimizer: {},
        loss: ""
    }
};

const settingSlice = createSlice({
    name: 'setting',
    initialState,

    reducers: {
        // layer function
        addLayer(state, action) {
            const newInfo = action.payload;

            state.layer.info.push({
                idx: state.layer._lastIdx + 1,
                info: newInfo
            });

            state.layer._lastIdx++;
        },
        addModel(state, action) {
            const inputLayer = {
                idx: "input",
                info: action.payload
            }

            if ( state.layer.isModel ) {
                state.layer.info[0] = inputLayer;
            } else {
                state.layer.isModel = true
                state.layer.info = [inputLayer].concat(state.layer.info);
            }
        },
        removeLayer(state, action) {
            const idx = action.payload;
            
            if ( ["input", "output"].includes(idx) ) {
                state.layer.info = state.layer.info.filter((information) => !["input", "output"].includes(information.idx));
                state.layer.isModel = false;
            } else {
                state.layer.info = state.layer.info.filter((information) => information.idx !== idx);
                state.layer._lastIdx--;
            }
        },
        reIndexing(state, action) {
            
            if ( state.layer.isModel ) {
                for (var i = 1; i < state.layer._lastIdx + 1; i++) {
                    state.layer.info[i].idx = i;
                }
            } else {
                state.layer.info.map((layer, idx) => {
                    layer.idx = idx + 1;
                });
            }
        },
        initLayer(state, action) {
            state.layer = {
                info: [],
                isModel: false,
                _lastIdx: 0
            };
        },
        // parameter function
        setParam(state, action) {
            state.parameter.info = action.payload;
        },
        removeParam(state, action) {
            state.parameter.info = {};
        },

        // compile function
        setOptimizer(state, action){
            state.compile.optimizer = action.payload;
        },
        setLoss(state, action){
            state.compile.loss = action.payload;
        },
        removeOptimizer(state, action) {
            state.compile.optimizer = {};
        },
        removeLoss(state, action){
            state.compile.loss = "";
        },
        initCompile(state, action) {
            state.compile.optimizer = {};
            state.compile.loss = ""
        },

        initialize(state, action) {
            state.layer = {
                info: [],
                isModel: false,
                _lastIdx: 0
            };
        
            state.parameter = {
                info: {}
            }
        
            state.compile = {
                optimizer: {},
                loss: ""
            }
        }
    }
})

export const settingActions = settingSlice.actions;

export default settingSlice