import React from 'react';
import render from '../../src/render';

describe('toHaveProp()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toHaveProp('foo');
    }).toThrowError('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes when a prop by name exists', () => {
      expect(() => {
        expect(render(<div id="foo" />).root()).toHaveProp('id');
      }).not.toThrowError();
    });

    it('errors when a prop by name doesnt exist', () => {
      expect(() => {
        expect(render(<div />).root()).toHaveProp('id');
      }).toThrowError('expected `div` to have a "id" prop');
    });

    it('passes when a prop by name exists and values match', () => {
      expect(() => {
        expect(render(<div id="foo" />).root()).toHaveProp('id', 'foo');
      }).not.toThrowError();
    });

    it('errors when a prop by name exists and values dont match', () => {
      expect(() => {
        expect(render(<div id="foo" />).root()).toHaveProp('id', 'bar');
      }).toThrowError('expected `div` to have a "id" prop with a value of "bar"');
    });
  });

  describe('negated', () => {
    it('passes when a prop by name doesnt exist', () => {
      expect(() => {
        expect(render(<div />).root()).not.toHaveProp('id');
      }).not.toThrowError();
    });

    it('errors when a prop by name exists', () => {
      expect(() => {
        expect(render(<div id="foo" />).root()).not.toHaveProp('id');
      }).toThrowError('expected `div` not to have a "id" prop');
    });

    it('passes when a prop by name exists and values dont match', () => {
      expect(() => {
        expect(render(<div id="foo" />).root()).not.toHaveProp('id', 'bar');
      }).not.toThrowError();
    });

    it('errors when a prop by name exists and values match', () => {
      expect(() => {
        expect(render(<div id="foo" />).root()).not.toHaveProp('id', 'foo');
      }).toThrowError('expected `div` not to have a "id" prop with a value of "foo"');
    });
  });
});
