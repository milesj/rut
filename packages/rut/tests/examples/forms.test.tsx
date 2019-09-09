/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState } from 'react';
import { render, mockSyntheticEvent } from '../../src';

describe('Forms Example', () => {
  interface SignupFormProps {
    onSubmit: (data: { email: string; password: string; username: string }) => void;
  }

  function SignupForm({ onSubmit }: SignupFormProps) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (event: React.SyntheticEvent) => {
      event.preventDefault();
      onSubmit({ email, password, username });
    };

    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            required
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={event => setEmail(event.currentTarget.value)}
          />
        </div>

        <div>
          <label htmlFor="username">Username</label>
          <input
            required
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={event => setUsername(event.currentTarget.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            required
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={event => setPassword(event.currentTarget.value)}
          />
        </div>

        <button type="submit" onClick={handleSubmit}>
          Sign Up
        </button>
      </form>
    );
  }

  // Simple test that checks that the form and its fields have rendered.
  it('renders a form', () => {
    const { root } = render<SignupFormProps>(<SignupForm onSubmit={() => {}} />);

    expect(root.find('form')).toHaveLength(1);
    expect(root.find('input')).toHaveLength(3);
  });

  // This test is a little more involved as we want to update the hook state
  // when an input field's value changes. To do this we must trigger an `onChange`
  // event with the target being changed.
  it('updates state when fields change and submits the form', () => {
    const submitSpy = jest.fn();
    const { root } = render<SignupFormProps>(<SignupForm onSubmit={submitSpy} />);

    // Update email using find + props pattern
    const email = root.find('input', { name: 'email' })[0];

    email.dispatch(
      'onChange',
      {},
      mockSyntheticEvent('onChange', { target: { value: 'rut@reactjs.com' } }),
    );

    expect(email).toHaveValue('rut@reactjs.com');

    // Update username using find at pattern
    const username = root.findAt('input', 1);

    username.dispatch(
      'onChange',
      {},
      mockSyntheticEvent('onChange', { target: { value: 'rut-is-best' } }),
    );

    expect(username).toHaveValue('rut-is-best');

    // Update password using find one pattern
    const password = root.findOne('input', { type: 'password' });

    password.dispatch(
      'onChange',
      {},
      mockSyntheticEvent('onChange', { target: { value: 'Sup3rs3cr3T!' } }),
    );

    expect(password).toHaveValue('Sup3rs3cr3T!');

    // Submit the form by dispatching an event on either the form or button
    const event = mockSyntheticEvent<React.SyntheticEvent<HTMLFormElement, Event>>('onSubmit');
    const preventSpy = jest.spyOn(event, 'preventDefault');

    root.findOne('form').dispatch('onSubmit', {}, event);

    // Assert that both our spies have been called!
    expect(preventSpy).toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalledWith({
      email: 'rut@reactjs.com',
      username: 'rut-is-best',
      password: 'Sup3rs3cr3T!',
    });
  });
});
