import React, { Component } from "react";
import SearchBar from "../Components/SearchBar/SearchBar";



let accessToken;
const clientID = '9fa143a0cac94bff944505f7f9658729';
const redirectURI = "https://damilola-agbaje.surge.sh";


const Spotify = {
getAccessToken(){
    if(accessToken){
return accessToken;
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    
      if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

    window.setTimeout(()=> accessToken="", expiresIn *1000);
    window.history.pushState('Access Token', null, '/');

    return accessToken;
        
}
else{
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}`+
    `&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    window.location = authUrl;
}

},

search(term){
     const accessToken =Spotify.getAccessToken();
return  fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
    {headers: {
        Authorization: `Bearer ${accessToken}`
    }}
)
.then(response => response.json())
.then(jsonResponse =>{
    if(!jsonResponse.tracks){
        return[];
    }
    return jsonResponse.tracks.items.map(track =>({
        id:track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri

    }));
});
},
savePlaylist(playlistName, uri){
if(!playlistName || !uri || uri.length ===0){
    return;
}
const accessToken = Spotify.getAccessToken();
const headers = { Authorization: `Bearer ${accessToken}`
};
let userID;
return fetch('https://api.spotify.com/v1/me',
    {headers : headers}
)
.then(response => response.json())
.then(jsonResponse=>{
    userID = jsonResponse.id;

    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,{
        method: 'POST',
        headers:{
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name:playlistName})
    })
})
 .then(response => response.json())
    .then(jsonResponse => {
      const playlistID = jsonResponse.id;


  return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}`,{
        method: 'POST',
        headers:{
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uris:uri })
});
});
}
}

export default Spotify;