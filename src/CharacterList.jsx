import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import crypto from 'crypto';
import {Glyphicon} from 'react-bootstrap';

import CharacterThumbnail from './CharacterThumbnail';

export default class CharactersList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {characters: []}
  }

  static defaultProps = {
    autoPoll: true,
    pollFrequency: 1000
  };

  static propTypes = {
    autoPoll: React.PropTypes.bool,
    pollFrequency: React.PropTypes.number
  };

  static contextTypes = {
    apiPublic:  React.PropTypes.string,
    apiPrivate: React.PropTypes.string,
    baseUrl:    React.PropTypes.string,
    listUri:    React.PropTypes.string,
    infoUri: React.PropTypes.string
  };

  loadFromMarvelServer() {
    var timestamp = Date.now();
    var concatenatedString = timestamp + this.context.apiPrivate + this.context.apiPublic;
    var md5hash = crypto.createHash('md5').update(concatenatedString).digest('hex');
    console.log(this.context.baseUrl + this.context.listUri + "?ts="+timestamp+"&apikey="+this.context.apiPublic+"&hash="+md5hash);
    $.ajax({
      url: this.context.baseUrl + this.context.listUri,
      method: 'GET',
      data: {
        ts: timestamp,
        apikey: this.context.apiPublic,
        hash: md5hash
      },
      dataType: 'json',
      success: (response) => {
        this.setState({characters: response.data.results});
      },
      error: (xhr, status, err) => {
        console.error(this.context.listUri, status, err.toString());
      }
    });
  }

  componentDidMount() {
    this.loadFromMarvelServer();
    if (this.props.autoPoll) {
      setInterval(this.loadFromMarvelServer(), this.props.pollFrequency);
    }
  }

  render() {
    var charactersThumbnails = this.state.characters.map(function (character) {
      return (
        <CharacterThumbnail key={character.id} id={character.id} character={character}/>
      );
    });
    if (this.state.characters.length > 0) {
      return (
        <div className="CharactersListPage">
          <h1>Liste des super h&eacute;ros :</h1>
          <div className="CharactersList">
            {charactersThumbnails}
          </div>
        </div>
      );
    }
    else return (
      <div className="CharactersListPage Loading">
        <Glyphicon glyph="hourglass"/>
      </div>
    );
  }
}