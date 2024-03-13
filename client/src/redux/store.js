import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import storage from 'redux-persist/lib/storage'
import {persistReducer, persistStore} from 'redux-persist';

//Combine reducers
const rootReducer=combineReducers({
    user:userReducer,
})

//Config for persisting Redux state
const persistConfig={
    key:'root', //Key for the persistor
    storage, //storage method (redux-persist storage)
    version:1,
}

const persistedReducer=persistReducer(persistConfig, rootReducer)

//Create Redux store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
    serializableCheck:false,
  }),
})

//Create the persistor
export const persistor=persistStore(store);