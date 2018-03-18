import IdeaType from 'model/entities/Idea';
import ImportFormType from 'vm/shared/ImportForm';
import Log from 'vm/shared/Log';

/**
 * Opens import form
 *
 * @param {IdeaType} targetIdea
 * @return {Partial.<ImportFormType>}
 */
export default function open(targetIdea) {
  return {
    targetIdeaTitle: targetIdea.title,
    log: new Log()
  };
}
