import IdeaType from 'model/entities/Idea';
import ImportFormType from 'vm/shared/ImportForm';
import Log from 'vm/shared/Log';
import ProgressBar from 'vm/shared/ProgressBar';

/**
 * Opens import form
 *
 * @param {IdeaType} targetIdea
 * @return {Partial.<ImportFormType>}
 */
export default function open(targetIdea) {
  return {
    targetIdeaTitle: targetIdea.title,
    file: null,
    log: new Log(),
    logIsShown: false,
    isInputEnabled: true,
    inProgress: false,
    token: null,
    progressBar: new ProgressBar(),
    importButton: {
      enabled: false,
      content: 'Import'
    }
  };
}
