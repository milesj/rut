/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { createAdapter } from 'rut/lib/adapters';
import DomElement from './DomElement';

export const { render, renderAndWait } = createAdapter(instance => new DomElement(instance));

export * from 'rut';
