import * as CSS from 'csstype';

/**
 * Extensions/fixes for third party type definitions.
 */

declare global {
  namespace Chai {
    interface Assertion {
      // TODO: pull-request this.
      withinTime(start: Date, end: Date): Assertion;
    }
  }
}

declare module 'csstype' {
  interface Properties {
    // custom props
    '--list-item-color'?: any;
  }
}

export default Object;