import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import sessionReducer from './session';
import songReducer from "./songs";
import commentReducer from "./comments";
import currentReducer from "./current";
import playlistsReducer from "./playlists";
import albumsReducer from "./albums";

const rootReducer = combineReducers({
  session: sessionReducer,
  songsState: songReducer,
  commentsState: commentReducer,
  currentState: currentReducer,
  playlistsState: playlistsReducer,
  albumsState: albumsReducer,
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
