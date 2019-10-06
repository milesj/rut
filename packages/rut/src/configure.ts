import { RendererOptions, IntegrationOptions } from './types';

export const globalOptions: RendererOptions = {};

export function configure(options: RendererOptions) {
  Object.assign(globalOptions, options);
}

export const integrationOptions: IntegrationOptions = {
  runWithTimers(cb) {
    return cb();
  },
};

export function configureIntegration(options: IntegrationOptions) {
  Object.assign(integrationOptions, options);
}
