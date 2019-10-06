import * as integration from 'jest-rut/src/integration';
import { configureIntegration } from 'rut/src/configure';

// Since this is a monorepo and our imports use lib/,
// it causes problem when running tests as Jest uses src/.
// To resolve this, we need to patch `jest-rut` manually.
configureIntegration(integration);
