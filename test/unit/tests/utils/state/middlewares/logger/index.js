import {expect} from 'chai';
import {stub} from 'sinon';
import EventEmitter from 'events';

import logger from 'utils/state/middlewares/logger';
import Patch from 'utils/state/Patch';

// console style tag
const S = '%c';

describe('logger', () => {

    before(() => {
        stub(console, 'groupCollapsed');
        stub(console, 'log');
        stub(console, 'groupEnd');
    });

    after(() => {
        console.groupCollapsed.restore();
        console.log.restore();
        console.groupEnd.restore();
    });

    beforeEach(() => {

        // reset console
        console.groupCollapsed.reset();
        console.log.reset();
        console.groupEnd.reset();

        // setup
        const storeEvents = new EventEmitter();
        
        logger(storeEvents);

        const action = {type: 'my-action', data: 'A'};
        const prevState = {model: 'prev model', vm: 'prev vm'};
        const patch = new Patch({type: 'my-mutation', data: 'M'});
        const nextState = {model: 'next model', vm: 'next vm'};

        storeEvents.emit('before-dispatch', action, prevState);
        storeEvents.emit('after-mutate', patch, nextState);
    });

    it('should make collapsed group', () => {

        expect(console.groupCollapsed.callCount).to.equal(1);
        expect(console.log.callCount).to.equal(4);
        expect(console.groupEnd.callCount).to.equal(1);
    });

    it('should log action name', () => {

        expect(console.groupCollapsed.firstCall.args[0]).to.match(
            RegExp(`${S}action ${S}my-action ${S}\\(\\d ms\\)`));
    });

    it('should log prev state', () => {

        expect(console.log.firstCall.args[0]).to.match(
            RegExp(`${S}prev state`));
        
        expect(console.log.firstCall.args[2]).to.deep.equal({
            model: 'prev model',
            vm: 'prev vm'
        });
    });

    it('should log action', () => {
    
        expect(console.log.secondCall.args[0]).to.match(
            RegExp(`${S}action`));
        
        expect(console.log.secondCall.args[2]).to.deep.equal({
            type: 'my-action',
            data: 'A'
        });
    });

    it('should log patch', () => {

        expect(console.log.thirdCall.args[0]).to.match(
            RegExp(`${S}state patch`));
        
        expect(console.log.thirdCall.args[2]).to.containSubset({
            mutations: [{
                type: 'my-mutation',
                data: 'M'
            }]
        });

    });

    it('should log next state', () => {

        expect(console.log.lastCall.args[0]).to.match(
            RegExp(`${S}next state`));

        expect(console.log.lastCall.args[2]).to.deep.equal({
            model: 'next model',
            vm: 'next vm'
        });

    });

});