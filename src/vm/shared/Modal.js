/**
 * Modal popup
 */
export default class Modal {
  /**
   * Indicates that it is visible.
   */
  active = false;

  /**
   * Indicates that it is scrolled to the top.
   *
   * Note: ideally we would map scroll position to view model, but it will
   * decrease rendering performance when scrolling. so this flag is enough
   * to move scroll position to the top when needed.
   */
  isScrolledTop = false;
}
