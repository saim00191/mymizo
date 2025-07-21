import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import wishlistReducer from './wishlist'
import userReducer from './user'
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
import storage from 'redux-persist/lib/storage' 

import { combineReducers } from 'redux'

// 1. Combine your reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  user:userReducer
})

// 2. Configure persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

// 3. Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// 4. Create the store with middleware adjustments for redux-persist serializable checks
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

// 5. Create the persistor to export
export const persistor = persistStore(store)

// 6. Export types for use in the app
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
