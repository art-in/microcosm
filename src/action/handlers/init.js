import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import * as ideaDB from 'data/db/ideas';
import * as assocDB from 'data/db/associations';
import * as mindmapDB from 'data/db/mindmaps';

import Mindmap from 'model/entities/Mindmap';
import Idea from 'model/entities/Idea';
import Point from 'model/entities/Point';

/**
 * Inits state
 * 
 * @param {object} state
 * @param {object} data
 * @return {Patch}
 */
export default async function init(state, data) {
    const {db, view} = required(data);

    if (!(await db.mindmaps.info()).doc_count) {
        // mindmap database is empty, creating one
        await mindmapDB.add(db.mindmaps, new Mindmap({
            pos: new Point({x: 0, y: 0}),
            scale: 1
        }));
    }

    if (!(await db.ideas.info()).doc_count) {
        // ideas database is empty, creating root idea
        await ideaDB.add(db.ideas, new Idea({
            isRoot: true,
            pos: new Point({x: 0, y: 0}),
            color: 'white'
        }));
    }

    return new Patch({
        type: 'init',
        data: {
            db,
            entities: {
                ideas: await ideaDB.getAll(db.ideas),
                associations: await assocDB.getAll(db.associations),
                mindmaps: await mindmapDB.getAll(db.mindmaps)
            },
            view
        }
    });
}