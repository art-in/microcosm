import React, { Component } from "react";
import cx from "classnames";

import { IDEA_TITLE_MAX_LENGTH } from "action/utils/is-valid-idea-title";

import IdeaFormVmType from "vm/shared/IdeaForm";
import Icon from "vm/shared/Icon";
import IconSize from "vm/shared/IconSize";

import Button from "view/shared/Button";
import IconButton from "view/shared/IconButton";
import IdeaList from "view/shared/IdeaList";
import MarkdownEditor from "view/shared/MarkdownEditor";
import IdeaPath from "view/shared/IdeaPath/IdeaPath";
import SearchBox from "view/shared/SearchBox";

import classes from "./IdeaForm.css";

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {string} [valueEditButtonClass]
 * @prop {IdeaFormVmType} form
 *
 * @prop {function()} [onKeyDown]
 * @prop {function({title})} onTitleChange
 * @prop {function({value})} onValueChange
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
export default class IdeaForm extends Component {
  onTitleChange = e => {
    const title = e.target.value;
    this.props.onTitleChange({ title });
  };

  onValueChange = value => {
    this.props.onValueChange({ value });
  };

  componentDidMount() {
    // TODO: does not work in case form was already mounted
    //       (ie. open form for existing idea, add child idea)
    if (this.props.form.shouldFocusTitleOnShow) {
      this.input.focus();
    }
  }

  render() {
    const {
      className,
      valueEditButtonClass,
      form,
      onKeyDown,
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
      <div className={cx(classes.root, className)} onKeyDown={onKeyDown}>
        <div className={classes.header}>
          {form.rootPath.length ? (
            <IdeaPath
              className={classes.rootPath}
              path={form.rootPath}
              onIdeaSelect={onNeighborIdeaSelect}
            />
          ) : null}

          <input
            placeholder="Short essence of idea"
            className={cx(classes.titleInput, {
              [classes.titleInputInvalid]: !form.isTitleValid
            })}
            value={form.title || ""}
            maxLength={IDEA_TITLE_MAX_LENGTH}
            ref={el => (this.input = el)}
            onChange={this.onTitleChange}
          />

          {form.predecessors.length ? (
            <IdeaList
              className={classes.predecessors}
              ideas={form.predecessors}
              layout="inline"
              onIdeaSelect={onNeighborIdeaSelect}
            />
          ) : null}

          {form.isGearMenuAvailable ? (
            <div
              className={cx(classes.gearMenu, {
                [classes.gearMenuExpanded]: form.isGearMenuExpanded
              })}
            >
              <IconButton
                className={cx(classes.gearButton, classes.gearMenuItem)}
                icon={Icon.gear}
                size={IconSize.large}
                tooltip="More operations"
                onClick={onGearMenuToggle}
              />

              <IconButton
                className={cx(classes.removeButton, classes.gearMenuItem)}
                icon={Icon.trash}
                size={IconSize.large}
                tooltip="Remove idea"
                onClick={onRemove}
              />

              <IconButton
                className={cx(classes.selectColorButton, classes.gearMenuItem)}
                style={{ ["--idea-color"]: form.color }}
                icon={Icon.paintBrush}
                size={IconSize.large}
                tooltip="Set idea color"
                onClick={onColorSelect}
              />

              <IconButton
                className={cx(classes.removeColorButton, classes.gearMenuItem)}
                icon={Icon.eraser}
                size={IconSize.large}
                tooltip="Remove color (inherit from parent)"
                onClick={onColorRemove}
              />
            </div>
          ) : null}
        </div>

        <div className={classes.body}>
          <MarkdownEditor
            className={classes.value}
            editButtonClass={valueEditButtonClass}
            value={form.value}
            editing={form.isEditingValue}
            placeholder="Full description of idea (markdown)"
            onToggleEdit={onValueToggleEdit}
            onChange={this.onValueChange}
            onDoubleClick={onValueDoubleClick}
          />

          {form.isSuccessorsEditable ? (
            <div className={classes.successorOperations}>
              <IconButton
                className={cx(
                  classes.successorCreateButton,
                  classes.successorOperationsItem
                )}
                icon={Icon.plusCircle}
                size={IconSize.large}
                tooltip="Add new idea"
                onClick={onSuccessorCreate}
              />

              <SearchBox
                className={cx(
                  classes.successorSearch,
                  classes.successorOperationsItem
                )}
                expandToRight={true}
                searchBox={form.successorSearchBox}
                lookupClass={classes.successorSearchLookup}
                triggerClass={classes.successorSearchTrigger}
                triggerTooltip="Add association"
                triggerIcon={Icon.link}
                onTriggerClick={onSuccessorSearchTriggerClick}
                onLookupFocusOut={onSuccessorSearchLookupFocusOut}
                onLookupPhraseChange={onSuccessorSearchLookupPhraseChange}
                onLookupKeyDown={onSuccessorSearchLookupKeyDown}
                onLookupSuggestionSelect={
                  onSuccessorSearchLookupSuggestionSelect
                }
              />
            </div>
          ) : null}

          {form.successors.length ? (
            <IdeaList
              className={classes.successors}
              ideas={form.successors}
              layout="column"
              onIdeaSelect={onNeighborIdeaSelect}
              onIdeaRemove={onSuccessorRemove}
            />
          ) : null}
        </div>

        <div className={classes.footer}>
          <Button
            type="secondary"
            disabled={!form.isCancelable}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            disabled={!form.isSaveable}
            title={form.isSaveable ? "Save changes (Ctrl+Enter)" : null}
            onClick={onSave}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
}
