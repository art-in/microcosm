/**
 * Modal popup
 */
export default class Modal {
  /**
   * Is it visible?
   */
  active = false;

  /**
   * Is its top visible?
   *
   * Note: ideally we would map scroll position to view model, but it will
   * decrease rendering performance when scrolling. so this flag is enough
   * to move scroll position to the top when needed.
   */
  isScrolledTop = false;
}
