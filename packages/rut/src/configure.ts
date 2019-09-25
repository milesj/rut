import { RendererOptions } from './types';

export const globalOptions: RendererOptions = {
  asyncMode: 'hook',
};

export function configure(options: RendererOptions) {
  Object.assign(globalOptions, options);
}
