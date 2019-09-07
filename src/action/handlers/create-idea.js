import moment from 'moment';

import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';

import isValidPathWeight from 'utils/graph/is-valid-path-weight';
import isValidIdeaTitle from 'action/utils/is-valid-idea-title';

import getIdea from 'action/utils/get-idea';
import weighAssociation from 'model/utils/weigh-association';

import Idea from 'model/entities/Idea';
import Association from 'model/entities/Association';
import Point from 'model/entities/Point';
import getNodeScaleForWeight from 'vm/map/utils/get-node-scale-for-weight';
import getNewIdeaPosition from 'action/utils/get-new-idea-position';

/**
 * Creates idea
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} [data.ideaId] - ID to use for new idea
 * @param {DateTimeISO} [data.createdOn]
 * @param {string} data.parentIdeaId
 * @param {string} data.title
 * @param {string} data.value
 * @return {Patch}
 */
export default function createIdea(state, data) {
  const {model} = state;
  const {mindset} = model;
  const {parentIdeaId, title, value} = required(data);
  const {ideaId} = data;
  let {createdOn} = data;

  const patch = new Patch();

  if (!isValidIdeaTitle(title)) {
    throw Error(`Invalid idea title '${title}'`);
  }

  if (value && typeof value !== 'string') {
    throw Error(`Invalid idea value '${value}'`);
  }

  if (createdOn) {
    const created = moment(createdOn, moment.ISO_8601);
    if (!created.isValid()) {
      throw Error(`Invalid ISO 8601 creation time string '${createdOn}'`);
    }

    // normalize different forms of ISO 8601
    createdOn = created.toISOString();
  } else {
    createdOn = moment().toISOString();
  }

  const parent = getIdea(mindset, parentIdeaId);

  const posRel = getNewIdeaPosition(
    parent.posRel,
    parent.edgesOut.map(edge => edge.to.posRel),
    getNodeScaleForWeight(parent.rootPathWeight)
  );

  const idea = new Idea({
    createdOn,
    mindsetId: mindset.id,
    posRel,
    posAbs: new Point({
      x: parent.posAbs.x + posRel.x,
      y: parent.posAbs.y + posRel.y
    }),
    title: title.trim(),
    value: value || ''
  });

  if (ideaId !== undefined) {
    idea.id = ideaId;
  }

  // add association from parent to new idea
  const assoc = new Association({
    createdOn,
    mindsetId: mindset.id,
    fromId: parent.id,
    from: parent,
    toId: idea.id,
    to: idea,
    weight: weighAssociation(parent.posAbs, idea.posAbs)
  });

  // bind to parent
  patch.push('update-idea', {
    id: parent.id,
    edgesOut: parent.edgesOut.concat([assoc]),
    edgesToChilds: parent.edgesToChilds.concat([assoc])
  });

  // bind to new idea
  idea.edgesIn.push(assoc);
  idea.edgeFromParent = assoc;
  idea.edgesToChilds = [];

  // ensure parent idea RPW is valid
  if (!isValidPathWeight(parent.rootPathWeight)) {
    throw Error(
      `Idea '${parent.id}' has invalid root path weight ` +
        `'${parent.rootPathWeight}'`
    );
  }

  idea.rootPathWeight = parent.rootPathWeight + assoc.weight;

  patch.push('add-association', {assoc});
  patch.push('add-idea', {idea});

  return patch;
}
