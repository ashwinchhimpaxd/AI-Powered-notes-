import { configureStore } from "@reduxjs/toolkit";

import TogglesStatesReducer from "./QuickChatAI/QuickChatAiSlice.js";
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
const rootReducer = combineReducers({
    ToggleStates: TogglesStatesReducer,
    NotesCreation: NotesCreationReducer,
    UserAuthantication: userauthanticationReducer,
    currentnoteinfoslice: currentnoteinfosliceReducer,
});

// persist config
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["currentnoteinfoslice"],//"UserAuthantication",
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