import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { loadMySongsThunk } from "../../store/current";
import { loadAllPlaylistsThunk } from "../../store/playlists";
import { NavLink } from "react-router-dom";
import './ProfileButton.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const userId = useSelector(state => state.session.user.id);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const mySongs = useSelector(state => state.currentState);
  const mySongsArr = Object.values(mySongs);

  const myPlaylists = useSelector(state => {
    const playlists = state.playlistsState;
    return Object.values(playlists).filter(playlist => playlist.userId === userId);
  });

  useEffect(() => {
    dispatch(loadMySongsThunk());
    dispatch(loadAllPlaylistsThunk()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch, userId]);

  return (
    <div className="profile-button-container">
      <button className="profile-button" onClick={openMenu}>
        <i className="fa-regular fa-user"></i>
      </button>
      {showMenu && (
        <ul className="profile-dropdown">
          <li className="profile-info">{user.username}</li>
          <li className="profile-info">{user.email}</li>
          <img className="profile-image" src={user.profileImageUrl || "https://storroom.com/wp-content/uploads/2019/02/default-user.png"} alt="Profile" />
          <div className="song-list">
            <span className="song-list-title">My Songs:</span>
            {mySongsArr.map((song) => (
              <NavLink key={song.id} className="my-song-title" to={`/songs/${song.id}`}>
                {song.title}
              </NavLink>
            ))}
          </div>
          {isLoaded && (
            <div className="song-list">
              <span className="song-list-title">My Playlists:</span>
              {myPlaylists.map((playlist) => (
                <NavLink key={playlist.id} className="my-song-title" to={`/playlists/${playlist.id}`}>
                  {playlist.name}
                </NavLink>
              ))}
            </div>
          )}
          <li>
            <button className="logout-button" onClick={logout}>Log Out</button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
