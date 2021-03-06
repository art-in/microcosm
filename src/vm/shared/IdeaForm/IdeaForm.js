import IdeaListItemType from 'vm/shared/IdeaListItem';
import SearchBox from 'vm/shared/SearchBox';
import Lookup from 'vm/shared/Lookup';

export const MESSAGE_CONFIRM_LEAVE =
  'There are unsaved changes on the form. Leave anyway?';

export const MESSAGE_CONFIRM_REMOVE = 'Remove following idea?';

/**
 * Form for showing and editing contents of Idea (title, value, etc.)
 */
export default class IdeaForm {
  /**
   * ID of existing idea
   * @type {string}
   */
  ideaId;

  /**
   * ID of parent idea (in case preparing contents for new idea)
   * @type {string}
   */
  parentIdeaId;

  /**
   * Indicates whether form works with contents of existing idea
   * or preparing contents for new idea
   * @type {boolean}
   */
  isNewIdea;

  /**
   * Title field contents
   * @type {string}
   */
  title;

  /**
   * Value field contents
   * @type {string}
   */
  value;

  /**
   * Color field contents
   * @type {string}
   */
  color;

  /**
   * Ideas on path from root to parent idea
   * @type {Array.<IdeaListItemType>}
   */
  rootPath;

  /**
   * Direct predecessor ideas (heads of incoming associations)
   * @type {Array.<IdeaListItemType>}
   */
  predecessors;

  /**
   * Direct successor ideas (tails of outgoing associations)
   * @type {Array.<IdeaListItemType>}
   */
  successors;

  /**
   * State of fields before last save.
   * Allows to revert state back when edit is canceled
   */
  prev = {
    /** @type {string} */
    title: undefined,

    /** @type {string} */
    value: undefined,

    /** @type {string} */
    color: undefined,

    /** @type {Array.<IdeaListItemType>} */
    successors: undefined
  };

  /**
   * Indicates that contents of title field is valid, otherwise should be
   * highlighted as invalid
   * @type {boolean}
   */
  isTitleValid = true;

  /**
   * Indicates that title field is focused and ready for input
   * @type {boolean}
   */
  isTitleFocused = false;

  /**
   * Indicates that value field is in edit mode
   * @type {boolean}
   */
  isEditingValue = false;

  /**
   * Indicates that additional operations (like remove idea, set color, etc)
   * are available
   * @type {boolean}
   */
  isGearMenuAvailable = false;

  /**
   * Indicates that menu with additional operations is expanded
   * @type {boolean}
   */
  isGearMenuExpanded = false;

  /**
   * Indicates that remove operation is available
   * @type {boolean}
   */
  isRemoveAvailable = false;

  /**
   * Indicates that list of successors can be edited
   * @type {boolean}
   */
  isSuccessorsEditable = false;

  /**
   * Indicates that form changes can be saved.
   * - there are unsaved changes
   * - and no invalid fields
   *
   * TODO: add separate 'hasChanges' flag (to fix case: create new idea,
   *       leave title empty, add value, try to close - should confirm close,
   *       but it does not, since form is not saveable because of invalid
   *       title and not because there is no changes)
   *
   * @type {boolean}
   */
  isSaveable = false;

  /**
   * Indicates that form changes can be canceled
   * @type {boolean}
   */
  isCancelable = false;

  /**
   * Search box for new successors
   * @type {SearchBox}
   */
  successorSearchBox = new SearchBox({
    lookup: new Lookup({placeholder: 'target idea...'}),
    tooltip: 'Add association'
  });
}
