import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
// import storage from 'redux-persist-indexeddb-storage';
import storage from "redux-persist/lib/storage/session";
import dataSlice from './dataSlice';
import trainSlice from './trainSlice';
import testSlice from './testSlice';
import preprocessingSlice from './preprocessingSlice';
import historySlice from './historySlice';
import settingSlice from './settingSlice';

const rootReducer = combineReducers({
  data: dataSlice.reducer,
  train: trainSlice.reducer,
  test: testSlice.reducer,
  preprocess: preprocessingSlice.reducer,
  history: historySlice.reducer,
  setting: settingSlice.reducer,
})

const persistConfig = {
  key: 'root',
  version: 1,
  storage: storage,
  //sotrage: storage("ML_DB")
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      // }).concat(logger),
    }),
});

export const persistor = persistStore(store);
export default store;