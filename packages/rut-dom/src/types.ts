import React from 'react';

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
  : {};

// EVENTS

export type EventMap<T> = Required<
  Omit<React.DOMAttributes<T>, 'children' | 'dangerouslySetInnerHTML'>
>;

export type EventType = keyof EventMap<unknown>;

export type EventOptions<T, E> = {
  currentTarget?: Partial<T>;
  target?: Partial<T>;
} & ExpandedEventOptions<E>;

export type ExpandedEventOptions<T> = T extends React.AnimationEvent | AnimationEvent
  ? { animationName?: string }
  : T extends
      | React.MouseEvent
      | React.KeyboardEvent
      | React.TouchEvent
      | MouseEvent
      | KeyboardEvent
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
