const baseUrl = 'https://api.spotify.com/v1/';

export async function getPlaylists(accessToken) {
  try {
    let data = null;
    const playlists = [];
    let nextUrl = `${baseUrl}me/playlists?limit=50`;
    do {
      const response = await fetch(nextUrl,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      data = await response.json();
      playlists.push(...data.items);
      nextUrl = data.next;
    } while (nextUrl);
    return playlists;
  } catch (err) {
    console.error('Error fetching playlists:', err);
  }
}

export async function getPlaylistTracks(accessToken, playlist) {
  try {
    const tracks = [];
    let nextUrl = playlist.tracks.href;
    do {
      const response = await fetch(nextUrl,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      tracks.push(...data.items.map(item => item.track));
      nextUrl = data.next;
    } while (nextUrl);
    return tracks;
  } catch (err) {
    console.error('Error fetching playlist tracks:', err);
  }
}

export async function createPlaylist(accessToken, name) {
  try {
    const response = await fetch(`${baseUrl}me/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    const json = await response.json();
    return json.id;
  } catch (err) {
    console.error('Error creating playlist:', err);
  }
}

export async function addTracksToPlaylist(accessToken, playlistId, tracks) {
  try {
    const splitUpTracks = [];
    for (let i = 0; i < tracks.length; i += 100) {
      const hundredTracks = tracks.slice(i, i + 100);
      splitUpTracks.push(hundredTracks);
    }
    await splitUpTracks.reduce(async (promise, hundredTracks) => {
      await promise;
      const response = await fetch(`${baseUrl}playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris: hundredTracks.map(track => track.uri) }),
      });
      const data = await response.json();
      console.log(data);
    }, Promise.resolve());
    return true;
  } catch (err) {
    console.error('Error adding tracks to playlist:', err);
    return false;
  }
}