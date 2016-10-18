import React from "react";
import ReactDOM from "react-dom";
import $ from 'jquery';
import crypto from 'crypto';
import {Well, Image, ListGroup, ListGroupItem, Glyphicon} from 'react-bootstrap';

export default class CharacterSheet extends React.Component {

  constructor(props) {
    super(props);

    this.state = {loaded: false}
  }

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
    var Url = this.context.baseUrl + this.context.infoUri.replace("{characterId}",this.props.params.characterId)
    console.log(Url + "?ts="+timestamp+"&apikey="+this.context.apiPublic+"&hash="+md5hash);
    $.ajax({
      url: Url,
      method: 'GET',
      data: {
        ts: timestamp,
        apikey: this.context.apiPublic,
        hash: md5hash
      },
      dataType: 'json',
      success: (response) => {
        console.dir(response);
        this.setState({character: response.data.results[0], loaded:true});
      },
      error: (xhr, status, err) => {
        console.error(this.context.listUri, status, err.toString());
      }
    });
  }

  componentDidMount() {
    this.loadFromMarvelServer();
  }

  mapCollectionToUL(collection) {
    var lis =  collection.items.map((item) => {
      return (
        <ListGroupItem>
          <a href={item.resourceURI} target="_blank">{item.name}</a>
        </ListGroupItem>
      );
    });
    return (
      <ListGroup>
        {lis}
      </ListGroup>
    );
  }

  render() {
    if (this.state.loaded) {
      return (
        <div className="CharacterSheet Loaded">
          <Image thumbnail width="300" src={this.state.character.thumbnail.path+"."+this.state.character.thumbnail.extension} />
          <div id="main-content">
            <h1>{this.state.character.name}</h1>
            <Well>
              <p>{this.state.character.description}</p>
            </Well>
            <h2>Comics</h2>
            {this.mapCollectionToUL(this.state.character.comics)}
            <h2>Series</h2>
            {this.mapCollectionToUL(this.state.character.series)}
          </div>
        </div>
      );
    }
    else return (
      <div className="CharacterSheet Loading">
        <Glyphicon glyph="hourglass"/>
      </div>
    );
  }
}