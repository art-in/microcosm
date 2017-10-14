import {expect} from 'test/utils';

import updateObject from 'utils/update-object';

describe('update-object', () => {

    it('should update properties of target object', () => {

        const target = {a: 1, b: 3};
        updateObject(target, {b: 2});
        
        expect(target).to.deep.equal({a: 1, b: 2});
    });

    it('should update props of nested objects', () => {

        const target = {nested: {a: 1}};
        updateObject(target, {nested: {a: 2}});
        
        expect(target).to.deep.equal({nested: {a: 2}});
    });

    it('should fail if target prop not found', () => {

        const target = {a: 1, b: 2};
        const result = () => updateObject(target, {c: 3});

        expect(result).to.throw(
            `Target object does not have property 'c' to update`);
    });

    it('should fail if target prop has different type', () => {

        const target = {nested: {a: 1}};
        const result = () => updateObject(target, {nested: 2});

        expect(result).to.throw(
            `Target prop 'nested' has type 'object' ` +
            `but source has type 'number'`);
    });

    it('should NOT fail if target prop is undefined', () => {
        
        const target = {a: undefined};
        const result = () => updateObject(target, {a: 1});

        expect(result).to.not.throw();
    });

    it('should NOT fail if source prop is null', () => {
        
        const target = {a: 1};
        const result = () => updateObject(target, {a: null});

        expect(result).to.not.throw();
    });

});