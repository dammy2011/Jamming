import React from "react";
import './App.css';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import Spotify from '../../util/Spotify';



  class App extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        searchResults: [],
        playlistName:'',
        playlistTracks: []
      };
      this.removeTrack = this.removeTrack.bind(this)
      this.updatePlaylistName=this.updatePlaylistName.bind(this)
      this.savePlaylist=this.savePlaylist.bind(this)
      this.search = this.search.bind(this)
    };
    // this is how to add method to a component.
    // it is usually between the constructor and the render 
    // the below code is to check if the track already exists
    addTrack(track){
      if(this.state.playlistTracks.find(savedTrack =>savedTrack.id === track.id)){
        return;
      }
      // this is to add a new track if the track does not exist
      this.setState(prevState =>({
        playlistTracks:[...prevState.playlistTracks, track]
      }))
    };

    removeTrack(track){

      const newPlaylist = this.state.playlistTracks.filter(savedTrack => savedTrack.id!== track.id);
       this.setState({
        playlistTracks:newPlaylist
       });
    };

    updatePlaylistName(name){
      this.setState({
        playlistName:name
      });

    };

    savePlaylist(){
      const trackURIs= this.state.playlistTracks.map(
        track => track.uri
      );
      Spotify.savePlaylist(this.state.playlistName, trackURIs)
    .then(() => {
      this.setState({
        playlistName: "New Playlist",
        playlistTracks: []
      });
    });
    };

    search(term){
       Spotify.search(term).then(searchResults =>{
        this.setState({
          searchResults:searchResults
        });
       });
    };

    render(){
      return (
    <>
     <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
        </h1>
      <div className="App">
         <SearchBar
         onSearch = {this.search}
         />
         <div className="App-playlist">
           <SearchResults 
           searchResults= {this.state.searchResults}
           onAdd ={this.addTrack}
           />
           <Playlist
           playlistName ={this.state.playlistName}
           playlistTracks={this.state.playlistTracks}
           onRemove = {this.removeTrack}
           onNameChange={this.updatePlaylistName}
           onSave = {this.savePlaylist}
          />
         </div>
       </div>
</div> 
</>
    
  );
};
}


export default App
