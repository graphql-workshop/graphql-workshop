import ApolloClient from 'apollo-boost';
import React, {Component} from 'react';
import {ApolloProvider} from 'react-apollo';
import './App.css';

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: async operation => {
    operation.setContext({
      headers: {
        Authorization: `bearer ${GITHUB_TOKEN}`,
      },
    });
  },
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <h1>GraphQL Playground</h1>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
