import {expect} from 'test/utils';

import updateObject from 'utils/update-object';

describe('update-object', () => {

    it('should update properties of target object', () => {

        const target = {a: 1, b: 3};
        const source = {b: 2};

        updateObject(target, source);
        
        expect(target).to.deep.equal({a: 1, b: 2});
    });

    it('should update props of nested objects', () => {

        const target = {nested: {a: 1}};
        const source = {nested: {a: 2}};

        updateObject(target, source);
        
        expect(target).to.deep.equal({nested: {a: 2}});
    });

    it('should replace nested arrays', () => {
        
        const target = {nested: [1, 2, 3]};
        const source = {nested: [4]};
        
        updateObject(target, source);
        
        expect(target).to.deep.equal({nested: [4]});
    });

    it('shold ignore prototype props of source', () => {

        const target = {a: 'original', b: 'original'};
        const source = {a: 'updated'};
        Object.setPrototypeOf(source, {b: 'updated'});

        updateObject(target, source);

        expect(target.a).to.equal('updated');
        expect(target.b).to.equal('original');
    });

    it(`should NOT update prop if 'shouldUpdate' returns false`, () => {

        const target = {a: 'original', b: 'original'};
        const source = {a: 'updated', b: 'updated'};
        const propHandler = (prop, targetValue, sourceValue) => {
            if (prop === 'b') {
                return false;
            }
        };

        updateObject(target, source, propHandler);

        expect(target.a).to.equal('updated');
        expect(target.b).to.equal('original');
    });

    it('should update object to null', () => {
        
        const target = {a: {}};
        const source = {a: null};

        updateObject(target, source);

        expect(target.a).to.equal(null);
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
            `Target prop 'nested' has type 'object', ` +
            `but source has type 'number'`);
    });

    it('should fail if updating array to object', () => {
        
        const target = {nested: []};
        const result = () => updateObject(target, {nested: {}});

        expect(result).to.throw(
            `Target prop 'nested' has type 'array', ` +
            `but source has type 'object'`);
    });

    it('should NOT fail if target prop is undefined', () => {
        
        const target = {a: undefined};
        const result = () => updateObject(target, {a: 1});

        expect(result).to.not.throw();
    });

    it('should fail if nested array items has different type', () => {
        
        const target = {nested: [1, 2]};
        const result = () => updateObject(target, {nested: ['3', '4']});
        
        expect(result).throw(
            `Items of target array 'nested' has type 'number', ` +
            `but items of source array has type 'string'`);
    });

    it('should fail if nested object is from different constructor', () => {
        
        /* eslint-disable require-jsdoc */
        class A {
            prop = undefined
        }
        class B {
            prop = undefined
        }

        const a = new A(); a.prop = 1;
        const b = new B(); b.prop = 2;

        const target = {obj: a};
        const source = {obj: b};

        const result = () => updateObject(target, source);
        
        expect(result).throw(
            `Target prop 'obj' has object constructed by 'A', ` +
            `but source object constructed by 'B'`);
    });

    it('should NOT fail if source nested object is generic object', () => {
        
        /* eslint-disable require-jsdoc */
        class A {
            prop = undefined
        }

        const a = new A(); a.prop = 1;
        const b = {prop: 2};

        const target = {obj: a};
        const source = {obj: b};

        updateObject(target, source);
        
        expect(target).to.deep.equal({obj: {prop: 2}});
    });

    it('should fail if array objects are from different constructor', () => {
        
        /* eslint-disable require-jsdoc */
        class A {
            prop = undefined
        }

        const a = new A(); a.prop = 1;
        const b = {prop: 2};

        const target = {arr: [a]};
        const source = {arr: [b]};

        const result = () => updateObject(target, source);
        
        expect(result).throw(
            `Objects of target array 'arr' were constructed by 'A', ` +
            `but objects of source array constructed by 'Object'`);
    });

});