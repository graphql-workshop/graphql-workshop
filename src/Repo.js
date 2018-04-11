import ApolloClient, {gql} from 'apollo-boost';
import React, {Component} from 'react';
import {ApolloProvider, Query} from 'react-apollo';

export const RepoFragment = gql`
  fragment RepoFragment on Repository {
    id
    name
    owner {
      login
    }
    stargazers {
      totalCount
    }
    viewerHasStarred
  }
`;

export class Repo extends Component {
  render() {
    const {repo} = this.props;
    return (
      <li>
        {repo.owner.login}/{repo.name} ({repo.userHasStarred
          ? '\u2605'
          : '\u2606'}{' '}
        {repo.stargazers.totalCount})
      </li>
    );
  }
}
