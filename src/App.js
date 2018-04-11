import ApolloClient, {gql} from 'apollo-boost';
import React, {Component} from 'react';
import {ApolloProvider, Query} from 'react-apollo';
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
  query UserReposQuery {
    user(login: "leebyron") {
      repositories(first: 20, orderBy: {field: STARGAZERS, direction: DESC}) {
        totalCount
        edges {
          node {
            id
            name
            owner {
              login
            }
          }
        }
      }
    }
  }
`;

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <h1>GraphQL Playground</h1>
          <Query query={UserReposQuery}>
            {({loading, error, data}) => {
              if (loading) return <div>Loading...</div>;
              if (error)
                return <div>Whoops, there was an error: {error.message}</div>;
              return (
                <div>
                  Lee's GitHub repos (first 20 of{' '}
                  {data.user.repositories.totalCount} total):
                  <ul className="user-repos">
                    {data.user.repositories.edges.map(edge => (
                      <li key={edge.node.id}>
                        {edge.node.owner.login}/{edge.node.name}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }}
          </Query>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
