import { GlobalOptions, IntegrationOptions } from './types';

export const globalOptions: GlobalOptions = {};

export function configure(options: GlobalOptions) {
  Object.assign(globalOptions, options);
}

export const integrationOptions: IntegrationOptions = {
  runWithTimers(cb) {
    return cb();
  },
};

export function integrate(options: IntegrationOptions) {
  Object.assign(integrationOptions, options);
}
