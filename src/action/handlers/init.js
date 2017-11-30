import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import * as ideaDB from 'data/db/ideas';
import * as assocDB from 'data/db/associations';
import * as mindmapDB from 'data/db/mindmaps';

import Mindmap from 'model/entities/Mindmap';
import Idea from 'model/entities/Idea';
import Point from 'model/entities/Point';

import StateType from 'boot/client/State';

import MainVM from 'vm/main/Main';
import MindmapVM from 'vm/main/Mindmap';

import buildGraph from 'model/utils/build-ideas-graph-from-objects';
import weighRootPaths from 'utils/graph/weigh-root-paths';
import setAbsolutePositions from 'action/utils/set-ideas-absolute-positions';

import toGraph from 'vm/map/mappers/mindmap-to-graph';

/**
 * Inits state
 * 
 * @param {StateType} state
 * @param {object} data
 * @return {Promise.<Patch>}
 */
export default async function init(state, data) {
    const {db, view} = required(data);

    // init database
    if ((await db.mindmaps.info()).doc_count === 0) {
        // mindmap database is empty, creating one
        await mindmapDB.add(db.mindmaps, new Mindmap({
            pos: new Point({x: 0, y: 0}),
            scale: 1
        }));
    }

    if ((await db.ideas.info()).doc_count === 0) {
        // ideas database is empty, creating root idea
        await ideaDB.add(db.ideas, new Idea({
            isRoot: true,
            posRel: new Point({x: 0, y: 0}),
            color: 'white'
        }));
    }

    // init model
    const model = {};

    // fetch models from db
    const ideas = await ideaDB.getAll(db.ideas);
    const associations = await assocDB.getAll(db.associations);
    const mindmaps = await mindmapDB.getAll(db.mindmaps);

    const mindmap = mindmaps[0];
    model.mindmap = mindmap;

    // init model
    mindmap.root = buildGraph(ideas, associations);
    weighRootPaths({root: mindmap.root});
    setAbsolutePositions({root: mindmap.root});

    associations.forEach(a => mindmap.associations.set(a.id, a));
    ideas.forEach(i => mindmap.ideas.set(i.id, i));

    // init view-model
    const vm = {};

    const main = new MainVM();
    main.mindmap = new MindmapVM();
    main.mindmap.graph = toGraph(mindmap);

    vm.main = main;

    return new Patch({
        type: 'init',
        data: {
            db,
            model,
            vm,
            view
        }
    });
}