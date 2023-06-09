import { createSlice } from "@reduxjs/toolkit";
import { getGameRequest, getGamesRequest, key } from "../../API";

const initialState = {
  status: null,
  gamePage: {},
  gamePageStatus: null,
  data: [],
  requestParams: {
    key: key,
    page: 1,
  },
};

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    setGamePage: (state, action) => {
      console.log(action.payload);
      return { ...state, gamePage: action.payload, gamePageStatus: "success" };
    },
    setGameStatusLoading: (state, action) => {
      return { ...state, gamePageStatus: "loading" };
    },
    setGameStatusError: (state, action) => {
      return { ...state, gamePageStatus: "error" };
    },
    setGamesData: (state, action) => {
      return {
        ...state,
        status: "success",
        data: action.payload,
        requestParams: {
          ...state.requestParams,
        },
      };
    },
    loadMore: (state, action) => {
      return {
        ...state,
        data: [...state.data, ...action.payload],
        requestParams: {
          ...state.requestParams,
          page: state.requestParams.page + 1,
        },
      };
    },
    setStatusError: (state, action) => {
      return { ...state, status: "error" };
    },
    setStatusLoading: (state, action) => {
      return { ...state, status: "loading" };
    },
    setRequestParam: (state, action) => {
      return {
        ...state,
        requestParams: { ...state.requestParams, ...action.payload },
      };
    },
  },
});

export const {
  setGamePage,
  setGameStatusError,
  setGameStatusLoading,
  setGamesData,
  loadMore,
  setStatusLoading,
  setStatusError,
  setRequestParam,
} = gamesSlice.actions;

export const getGamesList = (params = {}) => {
  return async (dispatch) => {
    dispatch(setStatusLoading());
    getGamesRequest(params)
      .then((data) => {
        console.log(data.results);
        dispatch(setGamesData(data.results));
      })
      .catch(() => {
        dispatch(setStatusError());
      });
  };
};

export const getNextGamesPage = (a, params = {}) => {
  return async (dispatch) => {
    getGamesRequest({ ...params, page: params.page + 1 }).then((data) => {
      a.isTrue = true;
      dispatch(loadMore(data.results));
    });
  };
};

export const getGameById = (id) => {
  return (dispatch) => {
    dispatch(setGameStatusLoading());
    getGameRequest(id)
      .then((data) => {
        dispatch(setGamePage(data));
      })
      .catch(() => {
        dispatch(setGameStatusError());
      });
  };
};

export default gamesSlice.reducer;
