import React from 'react';
import { render, renderAndWait, mockFetch, MockFetchResult } from '../../src';

describe('Async Example', () => {
  interface User {
    id: number;
    firstName: string;
    lastName: string;
  }

  interface UserProfileProps {
    id: number;
  }

  interface UserProfileState {
    error: Error | null;
    user: User | null;
  }

  class UserProfile extends React.Component<UserProfileProps, UserProfileState> {
    state: UserProfileState = {
      error: null,
      user: null,
    };

    componentDidMount() {
      this.loadUser();
    }

    componentDidUpdate(prevProps: UserProfileProps) {
      if (this.props.id !== prevProps.id) {
        this.loadUser();
      }
    }

    loadUser = () => {
      fetch(`/users/${this.props.id}`)
        .then((response) => response.json())
        .then((user) => {
          this.setState({ user });

          return user;
        })
        .catch((error) => {
          this.setState({ error });
        });
    };

    render() {
      const { error, user } = this.state;

      if (error) {
        return <div>Failed to load user {this.props.id}!</div>;
      }

      if (!user) {
        return <div>Loading...</div>;
      }

      return (
        <div className="user-card">
          <h1>
            {user.firstName} {user.lastName}
          </h1>
        </div>
      );
    }
  }

  let mock: MockFetchResult;

  // Mock our requests ahead of time. One that passes and one that fails.
  beforeEach(() => {
    mock = mockFetch('/', 200)
      .mock('/users/1', {
        id: 1,
        firstName: 'Bruce',
        lastName: 'Wayne',
      })
      .mock('/users/2', 404)
      .mock('/users/3', {
        id: 1,
        firstName: 'Clark',
        lastName: 'Kent',
      });
  });

  afterEach(() => {
    mock.restore();
  });

  // We use `render` here instead of `renderAndWait`,
  // so that we can assert the loading state. Otherwise
  // the user card will be rendered in the result.
  it('renders the loading state while request is in flight', () => {
    const { root } = render<UserProfileProps>(<UserProfile id={1} />);

    expect(root).toContainNode('Loading...');
  });

  // We now use `renderAndWait` here, coupled with async/await,
  // so that the rendered result waits for the fetch to complete.
  it('renders the error state when a request fails', async () => {
    const { root } = await renderAndWait<UserProfileProps>(<UserProfile id={2} />);

    expect(root).toContainNode('Failed to load user 2!');
  });

  // Again we use `renderAndWait` so that the request completes.
  // This time to test the success state.
  it('renders the user card when a request succeeds', async () => {
    const { root } = await renderAndWait<UserProfileProps>(<UserProfile id={1} />);

    // Since the names are interpolated in the component,
    // they also need to be here so that the `children`
    // structure is the same. (Only when using elements).
    expect(root).toContainNode(
      <h1>
        {/* eslint-disable-next-line react/jsx-curly-brace-presence */}
        {'Bruce'} {'Wayne'}
      </h1>,
    );
  });

  // Now we use `updateAndWait`, which is returned in the render result.
  // Coupled with async/await, we can wait for the fetch in the
  // update lifecycle to complete.
  it('re-fetches the user when IDs change', async () => {
    const { root, updateAndWait } = await renderAndWait<UserProfileProps>(<UserProfile id={1} />);

    // Can use a string directly here, instead of an element above.
    expect(root).toContainNode('Bruce Wayne');

    await updateAndWait({ id: 3 });

    // New name!
    expect(root).toContainNode('Clark Kent');
  });
});
