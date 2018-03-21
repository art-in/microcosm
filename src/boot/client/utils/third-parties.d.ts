/**
 * Fixes for third party type definitions.
 * TODO: pull-request type fixes.
 */
declare global {
  namespace Chai {
    interface Assertion {
      withinTime(start: Date, end: Date): Assertion;
    }
  }
}

export default Object;