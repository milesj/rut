/* eslint-disable @typescript-eslint/no-namespace */

import React from 'react';
import { ElementType } from 'rut';
import DomElement from './DomElement';

export type HostComponentType = keyof JSX.IntrinsicElements;

export type InferHostElement<T> = T extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[T]
  : T extends keyof SVGElementTagNameMap
  ? SVGElementTagNameMap[T]
  : unknown;

export type InferComponentProps<T> = T extends HostComponentType
  ? JSX.IntrinsicElements[T]
  : T extends React.ComponentType<infer P>
  ? P
  : never;

// EVENTS

export type EventMap<T> = Required<
  Omit<React.DOMAttributes<T>, 'children' | 'dangerouslySetInnerHTML'>
>;

export type EventType = keyof EventMap<unknown>;

export type EventOptions<T, E> = ExpandedEventOptions<E> & {
  currentTarget?: Partial<T>;
  target?: Partial<T>;
};

export type ExpandedEventOptions<T> = T extends AnimationEvent | React.AnimationEvent
  ? { animationName?: string }
  : T extends
      | KeyboardEvent
      | MouseEvent
      | React.KeyboardEvent
      | React.MouseEvent
      | React.TouchEvent
      | TouchEvent
  ? {
      altKey?: boolean;
      ctrlKey?: boolean;
      key?: string;
      keyCode?: number;
      metaKey?: boolean;
      shiftKey?: boolean;
    }
  : T extends React.TransitionEvent | TransitionEvent
  ? { propertyName?: string }
  : {};

export type DomPropsOf<T> = T extends DomElement<ElementType, infer P> ? P : never;

/* eslint-disable @typescript-eslint/method-signature-style */

declare global {
  namespace jest {
    interface Matchers<R, T> {
      // Add overloads specific to the DOM
      toHaveProp<K extends keyof DomPropsOf<T>>(name: K, value?: DomPropsOf<T>[K]): R;
      toHaveProps(props: Partial<DomPropsOf<T>>): R;
    }
  }
}
