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

const ViewerQuery = gql`
  query ViewerQuery {
    viewer {
      login
      smallAvatar: avatarUrl(size: 50)
      bigAvatar: avatarUrl(size: 250)
    }
  }
`;

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <h1>GraphQL Playground</h1>
          <Query query={ViewerQuery}>
            {({loading, error, data}) => {
              if (loading) return <div>Loading...</div>;
              if (error)
                return <div>Whoops, there was an error: {error.message}</div>;
              return (
                <div>
                  Congratulations! You are authenticated with GitHub as{' '}
                  {data.viewer.login}.
                  <div className="avatars">
                    <div>
                      Tiny avatar: <br />
                      <img
                        src={data.viewer.smallAvatar}
                        width={50}
                        height={50}
                      />
                    </div>
                    <div>
                      Giant avatar: <br />
                      <img
                        src={data.viewer.bigAvatar}
                        width={250}
                        height={250}
                      />
                    </div>
                  </div>
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
