import React from 'react';
import { Element, DispatchOptions } from 'rut';
import { InferHostElement, InferComponentProps, EventType } from './types';

export default class DomElement<Type extends React.ElementType = React.ElementType> extends Element<
  Type,
  InferComponentProps<Type>,
  InferHostElement<Type>
> {
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
  ): Element<T>[];
  find<T extends React.ComponentType<any>, P extends InferComponentProps<T>>(
    type: T,
    props?: Partial<P>,
  ): Element<T>[];
  find(type: React.ElementType<unknown>, props?: UnknownProps): Element<React.ElementType>[] {
    return super.find(type, props);
  }

  findAt<T extends HostComponentType, P extends InferComponentProps<T>>(
    type: T,
    at: AtIndexType,
    props?: Partial<P>,
  ): Element<T>;
  findAt<T extends React.ComponentType<any>, P extends InferComponentProps<T>>(
    type: T,
    at: AtIndexType,
    props?: Partial<P>,
  ): Element<T>;
  findAt(
    type: React.ElementType<unknown>,
    at: AtIndexType,
    props?: UnknownProps,
  ): Element<React.ElementType> {
    return super.findAt(type, at, props);
  }

  findOne<T extends HostComponentType, P extends InferComponentProps<T>>(
    type: T,
    props?: Partial<P>,
  ): Element<T>;
  findOne<T extends React.ComponentType<any>, P extends InferComponentProps<T>>(
    type: T,
    props?: Partial<P>,
  ): Element<T>;
  findOne(type: React.ElementType<unknown>, props?: UnknownProps): Element<React.ElementType> {
    return super.findOne(type, props);
  }
}
