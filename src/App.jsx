import React from 'react';
import ReactDOM from 'react-dom';

import CharactersList from './CharactersList';

export default class MarvelApp extends React.Component {

  constructor(props) {
    super(props);
  }

  static childContextTypes = {
    apiPublic: React.PropTypes.string,
    apiPrivate: React.PropTypes.string,
    baseUrl: React.PropTypes.string,
    listUri: React.PropTypes.string,
    infoUri: React.PropTypes.string
  };

  getChildContext() {
    return {
      apiPublic: "298bab46381a6daaaee19aa5c8cafea5",
      apiPrivate: "b0223681fced28de0fe97e6b9cd091dd36a5b71d",
      baseUrl: "http://gateway.marvel.com:80",
      listUri: "/v1/public/characters",
      infoUri: "/v1/public/characters/{characterId}"
    };
  }

  render() {
    return (
      <div className="MarvelApp">
        {this.props.children}
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

