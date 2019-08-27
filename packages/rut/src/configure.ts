import { RendererOptions } from './types';

export const globalOptions: RendererOptions = {};

export function configure(options: RendererOptions) {
  Object.assign(globalOptions, options);
}
