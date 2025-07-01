import { useState } from 'react';
import styles from './playlist.module.css'
import { getPlaylistTracks, createPlaylist, addTracksToPlaylist } from '../helpers/api.js';
import { shuffle } from '../helpers/utils.js';

function Playlist({ playlist, accessToken }) {
  const [clicked, setClicked] = useState(false);
  const [done, setDone] = useState(false);
  const [shuffledName, setShuffledName] = useState(`${playlist.name} (shuffled)`);

  async function shuffleByAlbum(playlist, accessToken, sort = false) {
    setClicked(true);
    const tracks = await getPlaylistTracks(accessToken, playlist);
    if (!tracks) {
      setClicked(false);
    }
    console.log(tracks);

    const albums = new Map();
    tracks.forEach((track) => {
      if (albums.has(track.album.id)) {
        albums.get(track.album.id).push(track);
      } else {
        albums.set(track.album.id, [track]);
      }
    })
    if (sort) {
      albums.forEach((tracks, albumId) => {
        albums.set(albumId, tracks.sort((a, b) => a.track_number - b.track_number));
      });
    }
    const shuffledTracks = shuffle(Array.from(albums.values())).flat();

    const newPlaylistId = await createPlaylist(accessToken, shuffledName);
    await addTracksToPlaylist(accessToken, newPlaylistId, shuffledTracks);
    setClicked(false);
    setDone(true);
    setTimeout(() => {
      setDone(false);
    }, 5000);
  }

  return (
    <div className={styles.playlist}>
      <img src={playlist.images?.[0]?.url} alt="Playlist Image" />

      <div>
        <div className={styles['playlist-name']}>
          {playlist.name}
        </div>
        {playlist.tracks?.total &&
          <div className={styles['track-count']}>
            {playlist.tracks.total} tracks
          </div>
        }
      </div>
      {playlist.tracks?.total && !clicked && !done &&
        <div className={styles['shuffle-controls']}>
          <div className={styles['shuffled-name']}>
            <label htmlFor="shuffledPlaylistName">Shuffled Name:</label>
            <input
              type="text"
              id="shuffledPlaylistName"
              defaultValue={`${playlist.name} (shuffled)`}
              onChange={(e) => setShuffledName(e.target.value)}
            />
          </div>
          <button className="shuffle-by-album" onClick={() => shuffleByAlbum(playlist, accessToken)}>
            Shuffle by album
          </button>
          <button className="shuffle-by-album-sorted" onClick={() => shuffleByAlbum(playlist, accessToken, true)}>
            Shuffle by album and sort each album
          </button>
        </div>
      }
      {playlist.tracks?.total && clicked &&
        <div className={styles['shuffle-loading']}>
          Shuffling...
        </div>
      }
      {playlist.tracks?.total && done &&
        <div className={styles['shuffle-loading']}>
          Shuffled successfully! Check your Spotify account.
        </div>
      }
    </div>
  )
}

export default Playlist

