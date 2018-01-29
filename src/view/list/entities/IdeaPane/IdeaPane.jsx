import React, {Component} from 'react';
import cx from 'classnames';

import IdeaPaneType from 'vm/list/entities/IdeaPane';

import IdeaForm from 'view/shared/IdeaForm';

import classes from './IdeaPane.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {IdeaPaneType} pane
 *
 * @prop {function()} onTitleChange
 * @prop {function()} onValueChange
 * @prop {function()} onValueToggleEdit
 * @prop {function()} onValueDoubleClick
 * @prop {function()} onNeighborIdeaSelect
 * @prop {function()} onGearMenuToggle
 * @prop {function()} onRemove
 * @prop {function()} onColorSelect
 * @prop {function()} onColorRemove
 * @prop {function()} onSuccessorCreate
 * @prop {function()} onSuccessorRemove
 * @prop {function()} onSuccessorSearchTriggerClick
 * @prop {function()} onSuccessorSearchLookupFocusOut
 * @prop {function()} onSuccessorSearchLookupPhraseChange
 * @prop {function()} onSuccessorSearchLookupKeyDown
 * @prop {function()} onSuccessorSearchLookupSuggestionSelect
 * @prop {function()} onSave
 * @prop {function()} onCancel
 *
 * @extends {Component<Props>}
 */
export default class IdeaPane extends Component {
  render() {
    const {
      className,
      pane,
      onTitleChange,
      onValueChange,
      onValueToggleEdit,
      onValueDoubleClick,
      onNeighborIdeaSelect,
      onGearMenuToggle,
      onRemove,
      onColorSelect,
      onColorRemove,
      onSuccessorCreate,
      onSuccessorRemove,
      onSuccessorSearchTriggerClick,
      onSuccessorSearchLookupFocusOut,
      onSuccessorSearchLookupPhraseChange,
      onSuccessorSearchLookupKeyDown,
      onSuccessorSearchLookupSuggestionSelect,
      onSave,
      onCancel
    } = this.props;

    return (
      <div className={cx(classes.root, className)}>
        <IdeaForm
          className={classes.form}
          form={pane.form}
          onTitleChange={onTitleChange}
          onValueChange={onValueChange}
          onValueToggleEdit={onValueToggleEdit}
          onValueDoubleClick={onValueDoubleClick}
          onNeighborIdeaSelect={onNeighborIdeaSelect}
          onGearMenuToggle={onGearMenuToggle}
          onRemove={onRemove}
          onColorSelect={onColorSelect}
          onColorRemove={onColorRemove}
          onSuccessorCreate={onSuccessorCreate}
          onSuccessorRemove={onSuccessorRemove}
          onSuccessorSearchTriggerClick={onSuccessorSearchTriggerClick}
          onSuccessorSearchLookupFocusOut={onSuccessorSearchLookupFocusOut}
          onSuccessorSearchLookupPhraseChange={
            onSuccessorSearchLookupPhraseChange
          }
          onSuccessorSearchLookupKeyDown={onSuccessorSearchLookupKeyDown}
          onSuccessorSearchLookupSuggestionSelect={
            onSuccessorSearchLookupSuggestionSelect
          }
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    );
  }
}
