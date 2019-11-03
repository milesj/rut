/* eslint-disable lines-between-class-members, no-dupe-class-members, @typescript-eslint/no-explicit-any */

import React from 'react';
import { AtIndexType, DispatchOptions, InferEventFromHandler, UnknownProps } from 'rut';
import { Element, SyntheticEvent } from 'rut/lib/adapters';
import { mockSyntheticEvent } from './mocks';
import {
  HostComponentType,
  InferComponentProps,
  InferHostElement,
  EventMap,
  EventType,
  EventOptions,
} from './types';

export default class DomElement<
  Type extends React.ElementType = React.ElementType,
  Props = InferComponentProps<Type>,
  Host = InferHostElement<Type>
> extends Element<Type, Props, Host> {
  createSyntheticEvent(
    eventType: EventType,
    event: unknown,
    elementType: React.ElementType,
  ): React.SyntheticEvent {
    // Event provided by consumer, so use as is
    if (event instanceof SyntheticEvent) {
      return event as React.SyntheticEvent;
    }

    // Either event options or nothing provided
    const options: EventOptions<HTMLElement, Event> =
      typeof event === 'object' && event !== null ? event : {};

    // Set a target automatically if not provided
    if (typeof elementType === 'string' && !options.target) {
      if (typeof document === 'undefined') {
        options.target = { tagName: elementType.toUpperCase() };
      } else {
        options.target = document.createElement(elementType);
      }
    }

    return mockSyntheticEvent(eventType, options);
  }

  dispatch<K extends EventType>(
    name: K,
    eventOrConfig?:
      | InferEventFromHandler<EventMap<Host>[K]>
      | EventOptions<Host, InferEventFromHandler<EventMap<Host>[K]>>,
    options: DispatchOptions = {},
  ): this {
    return super.dispatch(name, eventOrConfig, options);
  }

  async dispatchAndWait<K extends EventType>(
    name: K,
    eventOrConfig?:
      | InferEventFromHandler<EventMap<Host>[K]>
      | EventOptions<Host, InferEventFromHandler<EventMap<Host>[K]>>,
    options: DispatchOptions = {},
  ): Promise<void> {
    return super.dispatchAndWait(name, eventOrConfig, options);
  }

  find<T extends HostComponentType, P extends InferComponentProps<T>>(
    type: T,
    props?: Partial<P>,
  ): DomElement<T, P>[];
  find<T extends React.ComponentType<any>, P extends InferComponentProps<T>>(
    type: T,
    props?: Partial<P>,
  ): DomElement<T, P>[];
  find(type: React.ElementType<unknown>, props?: UnknownProps): DomElement<React.ElementType>[] {
    return super.find(type, props);
  }

  findAt<T extends HostComponentType, P extends InferComponentProps<T>>(
    type: T,
    at: AtIndexType,
    props?: Partial<P>,
  ): DomElement<T, P>;
  findAt<T extends React.ComponentType<any>, P extends InferComponentProps<T>>(
    type: T,
    at: AtIndexType,
    props?: Partial<P>,
  ): DomElement<T, P>;
  findAt(
    type: React.ElementType<unknown>,
    at: AtIndexType,
    props?: UnknownProps,
  ): DomElement<React.ElementType> {
    return super.findAt(type, at, props);
  }

  findOne<T extends HostComponentType, P extends InferComponentProps<T>>(
    type: T,
    props?: Partial<P>,
  ): DomElement<T, P>;
  findOne<T extends React.ComponentType<any>, P extends InferComponentProps<T>>(
    type: T,
    props?: Partial<P>,
  ): DomElement<T, P>;
  findOne(type: React.ElementType<unknown>, props?: UnknownProps): DomElement<React.ElementType> {
    return super.findOne(type, props);
  }
}
