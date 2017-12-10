import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';

import searchIdeas from 'action/utils/search-ideas';

describe('search-ideas', () => {

    it('should return ideas with substring in title', () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});

        const idea1 = new Idea({
            id: 'idea 1',
            title: '---#NOTFOUND#---'
        });
        const idea2 = new Idea({
            id: 'idea 2',
            title: '---#FOUND#---'
        });

        mindmap.ideas.set(idea1.id, idea1);
        mindmap.ideas.set(idea2.id, idea2);

        // target
        const result = searchIdeas(mindmap, {
            phrase: '#FOUND#'
        });

        // check
        expect(result).to.have.length(1);
        expect(result[0].id).to.equal('idea 2');
    });

    it('should return ideas with substring in value', () => {

        // setup
        const mindmap = new Mindmap({id: 'm'});

        const idea1 = new Idea({
            id: 'idea 1',
            value: '---#NOTFOUND#---'
        });
        const idea2 = new Idea({
            id: 'idea 2',
            value: '---#FOUND#---'
        });

        mindmap.ideas.set(idea1.id, idea1);
        mindmap.ideas.set(idea2.id, idea2);

        // target
        const result = searchIdeas(mindmap, {
            phrase: '#FOUND#'
        });

        // check
        expect(result).to.have.length(1);
        expect(result[0].id).to.equal('idea 2');
    });

    it('should search case insensitively', () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});

        const idea1 = new Idea({
            id: 'idea 1',
            title: '   FOUND'
        });
        const idea2 = new Idea({
            id: 'idea 2',
            value: 'Found   '
        });

        mindmap.ideas.set(idea1.id, idea1);
        mindmap.ideas.set(idea2.id, idea2);

        // target
        const result = searchIdeas(mindmap, {
            phrase: 'found'
        });

        // check
        expect(result).to.have.length(2);
    });

    it('should NOT return ideas from exclude list', () => {

        // setup
        const mindmap = new Mindmap({id: 'm'});
        
        const idea1 = new Idea({
            id: 'idea 1',
            value: 'phrase'
        });
        const idea2 = new Idea({
            id: 'idea 2',
            value: 'phrase'
        });

        mindmap.ideas.set(idea1.id, idea1);
        mindmap.ideas.set(idea2.id, idea2);

        // target
        const result = searchIdeas(mindmap, {
            phrase: 'phrase',
            excludeIds: ['idea 1']
        });

        // check
        expect(result).to.have.length(1);
        expect(result[0].id).to.equal('idea 2');
    });

    it('should return empty array if ideas not found', () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});

        const idea1 = new Idea({
            id: 'idea 1',
            value: '---#NOTFOUND#---'
        });
        const idea2 = new Idea({
            id: 'idea 2',
            value: '---#NOTFOUND#---'
        });

        mindmap.ideas.set(idea1.id, idea1);
        mindmap.ideas.set(idea2.id, idea2);

        // target
        const result = searchIdeas(mindmap, {
            phrase: '#FOUND#'
        });

        // check
        expect(result).to.have.length(0);
    });

    it('should fail if search string is empty', () => {

        // setup
        const mindmap = new Mindmap({id: 'm'});
        
        const idea1 = new Idea({
            id: 'idea 1',
            value: '---#NOTFOUND#---'
        });
        const idea2 = new Idea({
            id: 'idea 2',
            value: '---#NOTFOUND#---'
        });

        mindmap.ideas.set(idea1.id, idea1);
        mindmap.ideas.set(idea2.id, idea2);

        // target
        const result = () => searchIdeas(mindmap, {
            phrase: ''
        });

        // check
        expect(result).to.throw('Search string is empty');
    });

});