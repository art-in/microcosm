import React, {Component} from 'react';
import cx from 'classnames';

import {IDEA_TITLE_MAX_LENGTH} from 'action/utils/is-valid-idea-title';

import IdeaFormVmType from 'vm/shared/IdeaForm';
import IdeaList from 'view/shared/IdeaList';
import MarkdownEditor from 'view/shared/MarkdownEditor';
import Button from 'view/shared/Button';

import classes from './IdeaForm.css';

// eslint-disable-next-line valid-jsdoc
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
 * @prop {function()} onSave
 * @prop {function()} onCancel
 * 
 * @extends {Component<Props>}
 */
export default class IdeaForm extends Component {

    onTitleChange = e => {
        const title = e.target.value;
        this.props.onTitleChange({title});
    }

    onValueChange = value => {
        this.props.onValueChange({value});
    }

    componentDidMount() {
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
            onSave,
            onCancel,
            onValueToggleEdit,
            onValueDoubleClick,
            onNeighborIdeaSelect
        } = this.props;

        return (
            <div className={cx(classes.root, className)}
                onKeyDown={onKeyDown}>

                <div className={classes.header}>
                    <input
                        placeholder='Short essence of idea'
                        className={cx(classes.titleInput, {
                            [classes.titleInputInvalid]: !form.isTitleValid
                        })}
                        value={form.title || ''}
                        maxLength={IDEA_TITLE_MAX_LENGTH}
                        ref={el => this.input = el}
                        onChange={this.onTitleChange} />
                </div>

                <div className={classes.body}>
                    <MarkdownEditor className={classes.valueEditor}
                        editButtonClass={valueEditButtonClass}
                        value={form.value}
                        editing={form.isEditingValue}
                        placeholder='Full description of idea (markdown)'
                        onToggleEdit={onValueToggleEdit}
                        onChange={this.onValueChange}
                        onDoubleClick={onValueDoubleClick} />

                    <hr/>

                    <IdeaList className={classes.successors}
                        ideas={form.successors}
                        onIdeaSelect={onNeighborIdeaSelect} />
                </div>

                <div className={classes.footer}>
                    <Button
                        type='secondary'
                        disabled={!form.isCancelable}
                        onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onSave}
                        disabled={!form.isSaveable}>
                        Save
                    </Button>
                </div>

            </div>
        );
    }

}