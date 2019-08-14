export type Args<T> = T extends (...args: unknown[]) => unknown ? Parameters<T> : unknown[];

export interface UnknownProps {
  [key: string]: unknown;
}
