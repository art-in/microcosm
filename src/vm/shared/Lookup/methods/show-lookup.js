import required from 'utils/required-params';
import clearLookup from './clear-lookup';

/**
 * Creates update object to show lookup
 * 
 * @param {object}   opts
 * @param {function} opts.onSelectAction
 * @param {function} opts.onPhraseChangeAction
 * @return {object} lookup update object
 */
export default function show(opts) {
    const {onSelectAction, onPhraseChangeAction} = required(opts);

    return Object.assign(
        clearLookup(),
        {
            focused: true,
            onSelectAction,
            onPhraseChangeAction
        });
}