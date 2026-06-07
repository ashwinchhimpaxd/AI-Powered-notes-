import { configureStore } from "@reduxjs/toolkit";


import NotesCreationReducer from "./NotesCreation/NotesCreationSlice.js";
import userauthanticationReducer from "./Authantication/UserAuthanticationSlice.js";
import currentnoteinfosliceReducer from "./currentnoteinfoslice/currentnoteinfoslice.js";
import storage from "redux-persist/lib/storage";
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import { combineReducers } from "redux";

// reducers combine karo
const appReducer = combineReducers({
    NotesCreation: NotesCreationReducer,
    UserAuthantication: userauthanticationReducer,
    currentnoteinfoslice: currentnoteinfosliceReducer,
});

// Intercept logout to completely clear state and persisted store
const rootReducer = (state, action) => {
    if (action.type === "UserAuth/logout") {
        storage.removeItem("persist:root");
        state = undefined;
    }
    return appReducer(state, action);
};

// persist config
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["currentnoteinfoslice", "UserAuthantication", "NotesCreation"],//"UserAuthantication",
    // sirf auth persist karna hai (recommended)
};

// persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// store create
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

// persistor export
export const persistor = persistStore(store);