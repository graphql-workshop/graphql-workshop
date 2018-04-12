import {gql} from 'apollo-boost';
import React, {Component} from 'react';
import {Mutation} from 'react-apollo';

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

const StarRepoMutation = gql`
  mutation StarRepoMutation($repoId: ID!) {
    addStar(input: {starrableId: $repoId}) {
      starrable {
        ...RepoFragment
      }
    }
  }
  ${RepoFragment}
`;

const UnStarRepoMutation = gql`
  mutation UnStarRepoMutation($repoId: ID!) {
    removeStar(input: {starrableId: $repoId}) {
      starrable {
        ...RepoFragment
      }
    }
  }
  ${RepoFragment}
`;

export class Repo extends Component {
  render() {
    const {repo} = this.props;
    return (
      <Mutation mutation={UnStarRepoMutation}>
        {(unStar, unStarMutationState) => (
          <Mutation mutation={StarRepoMutation}>
            {(addStar, starMutationState) => {
              const isStarMutationLoading =
                (unStarMutationState && unStarMutationState.loading) ||
                (starMutationState && starMutationState.loading);
              return (
                <li>
                  {repo.owner.login}/{repo.name}{' '}
                  <span
                    className={
                      'repo-star-input' +
                      (isStarMutationLoading ? ' loading' : '')
                    }
                    onClick={() =>
                      repo.viewerHasStarred
                        ? unStar({
                            variables: {repoId: repo.id},
                            optimisticResponse: {
                              removeStar: {
                                __typename: 'Mutation',
                                starrable: {
                                  ...repo,
                                  viewerHasStarred: false,
                                  stargazers: {
                                    ...repo.stargazers,
                                    totalCount: repo.stargazers.totalCount - 1,
                                  },
                                },
                              },
                            },
                          })
                        : addStar({
                            variables: {repoId: repo.id},
                            optimisticResponse: {
                              addStar: {
                                __typename: 'Mutation',
                                starrable: {
                                  ...repo,
                                  viewerHasStarred: true,
                                  stargazers: {
                                    ...repo.stargazers,
                                    totalCount: repo.stargazers.totalCount + 1,
                                  },
                                },
                              },
                            },
                          })
                    }>
                    ({repo.viewerHasStarred ? '\u2605' : '\u2606'}{' '}
                  </span>
                  {repo.stargazers.totalCount})
                </li>
              );
            }}
          </Mutation>
        )}
      </Mutation>
    );
  }
}
