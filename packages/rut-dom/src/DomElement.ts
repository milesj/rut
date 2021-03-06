/* eslint-disable lines-between-class-members, no-dupe-class-members, @typescript-eslint/no-explicit-any */

import React from 'react';
import {
  AtIndexType,
  DispatchOptions,
  ElementType,
  InferEventFromHandler,
  Predicate,
  QueryOptions,
  UnknownProps,
} from 'rut';
import { Element, SyntheticEvent } from 'rut/lib/adapters';
import { mockSyntheticEvent } from './mocks';
import {
  EventMap,
  EventOptions,
  EventType,
  HostComponentType,
  InferComponentProps,
  InferHostElement,
} from './types';

export default class DomElement<
  Type extends ElementType = ElementType,
  Props = InferComponentProps<Type>,
  Host = InferHostElement<Type>
> extends Element<Type, Props, Host> {
  createSyntheticEvent(
    eventType: EventType,
    event: unknown,
    elementType: ElementType,
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
      | EventOptions<Host, InferEventFromHandler<EventMap<Host>[K]>>
      | InferEventFromHandler<EventMap<Host>[K]>,
    options: DispatchOptions = {},
  ): this {
    return super.dispatch(name, eventOrConfig, options);
  }

  async dispatchAndWait<K extends EventType>(
    name: K,
    eventOrConfig?:
      | EventOptions<Host, InferEventFromHandler<EventMap<Host>[K]>>
      | InferEventFromHandler<EventMap<Host>[K]>,
    options: DispatchOptions = {},
  ): Promise<void> {
    return super.dispatchAndWait(name, eventOrConfig, options);
  }

  find<T extends HostComponentType, P extends InferComponentProps<T>>(
    type: T,
    props?: Partial<P>,
  ): DomElement<T>[];
  find<T extends React.ComponentType<any>, P extends InferComponentProps<T>>(
    type: T,
    props?: Partial<P>,
  ): DomElement<T>[];
  find(type: React.ElementType, props?: UnknownProps): DomElement<React.ElementType>[] {
    return super.find(type, props);
  }

  findAt<T extends HostComponentType, P extends InferComponentProps<T>>(
    type: T,
    at: AtIndexType,
    props?: Partial<P>,
  ): DomElement<T>;
  findAt<T extends React.ComponentType<any>, P extends InferComponentProps<T>>(
    type: T,
    at: AtIndexType,
    props?: Partial<P>,
  ): DomElement<T>;
  findAt(
    type: React.ElementType,
    at: AtIndexType,
    props?: UnknownProps,
  ): DomElement<React.ElementType> {
    return super.findAt(type, at, props);
  }

  findOne<T extends HostComponentType, P extends InferComponentProps<T>>(
    type: T,
    props?: Partial<P>,
  ): DomElement<T>;
  findOne<T extends React.ComponentType<any>, P extends InferComponentProps<T>>(
    type: T,
    props?: Partial<P>,
  ): DomElement<T>;
  findOne(type: React.ElementType, props?: UnknownProps): DomElement<React.ElementType> {
    return super.findOne(type, props);
  }

  query<T extends ElementType>(predicate: Predicate, options?: QueryOptions): DomElement<T>[] {
    return super.query(predicate, options);
  }
}
