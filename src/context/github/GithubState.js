import React, { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import { 
  REACT_APP_GITHUB_CLIENT_ID, 
  REACT_APP_GITHUB_CLIENT_SECRET, 
  API_BASE
} from '../../utils';
import {
  SEARCH_USERS,
  GET_USER,
  GET_REPOS,
  CLEAR_USERS,
  SET_LOADING
} from '../types';

const GithubState = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  const searchUsers = async text => {
    setLoading();
    const res = await axios.get(
      `${API_BASE}/search/users?q=${text}&client_id=${REACT_APP_GITHUB_CLIENT_ID}&client_secret=${REACT_APP_GITHUB_CLIENT_SECRET}`
    );
    dispatch({
      type: SEARCH_USERS,
      payload: res.data.items
    });
  };

  const getUser = async username => {
    setLoading();
    const res = await axios.get(
      `${API_BASE}/users/${username}?client_id=${REACT_APP_GITHUB_CLIENT_ID}&client_secret=${REACT_APP_GITHUB_CLIENT_SECRET}`
    );
    dispatch({ type: GET_USER, payload: res.data });
  };

  // get repos
  const getUserRepos = async username => {
    setLoading();
    const res = await axios.get(
      `${API_BASE}/users/${username}/repos?per_page=5&sort=created:asc&client_id=${REACT_APP_GITHUB_CLIENT_ID}&client_secret=${REACT_APP_GITHUB_CLIENT_SECRET}`
    );
    dispatch({ type: GET_REPOS, payload: res.data });
  };

  const clearUsers = () => {
    setLoading();
    dispatch({
      type: CLEAR_USERS
    });
  };

  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubState;
