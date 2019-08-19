import React from 'react';
import render from '../src/render';

describe('debug()', () => {
  it('formats array props', () => {
    function ArrayProp({ list }: { list: unknown[] }) {
      return <ul />;
    }

    const wrapper = render(<ArrayProp list={['string', 123, true, null, {}, []]} />);

    expect(wrapper.debug()).toMatchSnapshot();
  });
});
