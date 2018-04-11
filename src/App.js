import ApolloClient, {gql} from 'apollo-boost';
import React, {Component} from 'react';
import {ApolloProvider, Query} from 'react-apollo';

import {RepoFragment, Repo} from './Repo';

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

const UserReposQuery = gql`
  query UserReposQuery($login: String!, $count: Int!) {
    user(login: $login) {
      login
      repositories(
        first: $count
        orderBy: {field: STARGAZERS, direction: DESC}
      ) {
        totalCount
        edges {
          node {
            ...RepoFragment
          }
        }
      }
    }
  }

  ${RepoFragment}
`;

class App extends Component {
  state = {login: 'leebyron', loginInput: 'leebyron', repoCount: 5};
  _handleLoginInputChange = event => {
    this.setState({loginInput: event.target.value});
  };
  _handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.setState({login: this.state.loginInput});
    }
  };
  _handleRepoCountChange = event => {
    this.setState({repoCount: parseInt(event.target.value, 10)});
  };
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <h1>GraphQL Playground</h1>
          <div className="repos-container">
            <div className="repos-login-input">
              Fetch{' '}
              <input
                className="repo-count-input"
                value={this.state.repoCount}
                onChange={this._handleRepoCountChange}
                type="number"
              />{' '}
              repos for{' '}
              <input
                value={this.state.loginInput}
                onChange={this._handleLoginInputChange}
                onKeyPress={this._handleKeyPress}
                type="text"
              />
            </div>
            <Query
              query={UserReposQuery}
              variables={{
                login: this.state.login,
                count: this.state.repoCount,
              }}>
              {({loading, error, data}) => {
                if (loading) return <div>Loading...</div>;
                if (error)
                  return <div>Whoops, there was an error: {error.message}</div>;
                return (
                  <div>
                    {data.user.login}'s GitHub repos (first{' '}
                    {this.state.repoCount} of{' '}
                    {data.user.repositories.totalCount} total):
                    <ul className="user-repos">
                      {data.user.repositories.edges.map(edge => (
                        <Repo repo={edge.node} key={edge.node.id} />
                      ))}
                    </ul>
                  </div>
                );
              }}
            </Query>
          </div>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
