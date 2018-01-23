import LookupType from "vm/shared/Lookup";

import clearLookup from "./clear-lookup";

/**
 * Shows lookup
 *
 * @return {Partial<LookupType>} update object
 */
export default function show() {
  return Object.assign(clearLookup(), {
    focused: true
  });
}
