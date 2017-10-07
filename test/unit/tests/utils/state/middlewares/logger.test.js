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

    describe('logging successful action', () => {
  
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
    
            storeEvents.emit('before-dispatch', {action, state: prevState});
            storeEvents.emit('after-mutation', {patch, state: nextState});
        });

        it('should make collapsed group', () => {
            expect(console.groupCollapsed.callCount).to.equal(1);
            expect(console.log.callCount).to.equal(4);
            expect(console.groupEnd.callCount).to.equal(1);
        });
    
        it('should log action name', () => {
            expect(console.groupCollapsed.firstCall.args[0]).to.match(
                RegExp(`^${S}action ${S}my-action`));
        });
        
        it('should log duration', () => {
            expect(console.groupCollapsed.firstCall.args[0]).to.match(
                RegExp(`${S}\\(\\d ms\\)$`));
        });
    
        it('should log prev state', () => {
            expect(console.log.getCall(0).args[0]).to.match(
                RegExp(`${S}prev state`));
            
            expect(console.log.getCall(0).args[2]).to.deep.equal({
                model: 'prev model',
                vm: 'prev vm'
            });
        });
    
        it('should log action', () => {
            expect(console.log.getCall(1).args[0]).to.match(
                RegExp(`${S}action`));
            
            expect(console.log.getCall(1).args[2]).to.deep.equal({
                type: 'my-action',
                data: 'A'
            });
        });
    
        it('should log patch', () => {
            expect(console.log.getCall(2).args[0]).to.match(
                RegExp(`${S}patch`));
            
            expect(console.log.getCall(2).args[2]).to.containSubset({
                mutations: [{
                    type: 'my-mutation',
                    data: 'M'
                }]
            });
        });
    
        it('should log next state', () => {
            expect(console.log.getCall(3).args[0]).to.match(
                RegExp(`${S}next state`));
    
            expect(console.log.getCall(3).args[2]).to.deep.equal({
                model: 'next model',
                vm: 'next vm'
            });
    
        });

    });

    describe('logging action failed on dispatch', () => {

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
            const error = new Error('boom');
    
            storeEvents.emit('before-dispatch', {action, state: prevState});
            storeEvents.emit('dispatch-fail', {error});
        });

        it('should make collapsed group', () => {
            expect(console.groupCollapsed.callCount).to.equal(1);
            expect(console.log.callCount).to.equal(2);
            expect(console.groupEnd.callCount).to.equal(1);
        });
    
        it('should log action name', () => {
            expect(console.groupCollapsed.firstCall.args[0]).to.match(
                RegExp(`^${S}action ${S}my-action`));
        });
        
        it('should log duration', () => {
            expect(console.groupCollapsed.firstCall.args[0]).to.match(
                RegExp(`${S}\\(\\d ms\\)`));
        });

        it('should log fail source', () => {
            expect(console.groupCollapsed.firstCall.args[0]).to.match(
                RegExp(`${S} \\[failed on dispatch\\]`));
        });

        it('should log prev state', () => {
            expect(console.log.getCall(0).args[0]).to.match(
                RegExp(`${S}prev state`));
            
            expect(console.log.getCall(0).args[2]).to.deep.equal({
                model: 'prev model',
                vm: 'prev vm'
            });
        });
    
        it('should log action', () => {
            expect(console.log.getCall(1).args[0]).to.match(
                RegExp(`${S}action`));
            
            expect(console.log.getCall(1).args[2]).to.deep.equal({
                type: 'my-action',
                data: 'A'
            });
        });
    
        it('should NOT log patch', () => {
            expect(console.log.getCall(2)).to.not.exist;
        });
    
        it('should NOT log next state', () => {
            expect(console.log.getCall(3)).to.not.exist;
        });
    });

    describe('logging action failed on mutation', () => {
        
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
            const error = new Error('boom');
    
            storeEvents.emit('before-dispatch', {action, state: prevState});
            storeEvents.emit('mutation-fail', {error, patch});
        });

        it('should make collapsed group', () => {
            expect(console.groupCollapsed.callCount).to.equal(1);
            expect(console.log.callCount).to.equal(3);
            expect(console.groupEnd.callCount).to.equal(1);
        });
    
        it('should log action name', () => {
            expect(console.groupCollapsed.firstCall.args[0]).to.match(
                RegExp(`^${S}action ${S}my-action`));
        });
        
        it('should log duration', () => {
            expect(console.groupCollapsed.firstCall.args[0]).to.match(
                RegExp(`${S}\\(\\d ms\\)`));
        });

        it('should log fail source', () => {
            expect(console.groupCollapsed.firstCall.args[0]).to.match(
                RegExp(`${S} \\[failed on mutation\\]`));
        });

        it('should log prev state', () => {
            expect(console.log.getCall(0).args[0]).to.match(
                RegExp(`${S}prev state`));
            
            expect(console.log.getCall(0).args[2]).to.deep.equal({
                model: 'prev model',
                vm: 'prev vm'
            });
        });
    
        it('should log action', () => {
            expect(console.log.getCall(1).args[0]).to.match(
                RegExp(`${S}action`));
            
            expect(console.log.getCall(1).args[2]).to.deep.equal({
                type: 'my-action',
                data: 'A'
            });
        });
    
        it('should log patch', () => {
            expect(console.log.getCall(2).args[0]).to.match(
                RegExp(`${S}patch`));
            
            expect(console.log.getCall(2).args[2]).to.containSubset({
                mutations: [{
                    type: 'my-mutation',
                    data: 'M'
                }]
            });
        });
    
        it('should NOT log next state', () => {
            expect(console.log.getCall(3)).to.not.exist;
        });
    });

});