import { useEffect, useState } from 'react';
import styles from './shuffler.module.css'
import { getPlaylists } from '../helpers/api.js';
import Playlist from './Playlist.jsx';

function Shuffler({ accessToken }) {
  const [playlists, setPlaylists] = useState([]);
  
  useEffect(() => {
    async function fetchPlaylists() {
      const maybePlaylists = await getPlaylists(accessToken);
      if (maybePlaylists) {
        setPlaylists(maybePlaylists);
      }
    }
    fetchPlaylists();
  }, [accessToken]);

  if (!playlists.length) {
    return <div className="loading">Loading...</div>;
  } else {
    return (
      <div className="playlists">
        <h1>Playlists</h1>
        <div className={styles['playlist-list']}>
          {playlists.map((playlist) => (
            <div key={playlist.id}>
              <Playlist playlist={playlist} accessToken={accessToken} key={playlist.id} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Shuffler