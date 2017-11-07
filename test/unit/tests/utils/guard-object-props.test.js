import {expect} from 'test/utils';

import guardObjectProps from 'src/utils/guard-object-props';

describe('guard-object-props', () => {

    it('should fail to read unexisting prop', () => {

        const obj = guardObjectProps({a: 1});

        const result = () => obj.X;

        expect(result).to.throw(`Failed to read unexisting property 'X'`);
    });

    it('should NOT fail to read existing prop', () => {

        const obj = guardObjectProps({a: 1});

        const result = obj.a;

        expect(result).to.equal(1);
    });

    it('should NOT fail to read prototype prop', () => {

        const proto = {a: 1};
        const targetObj = Object.create(proto);

        const obj = guardObjectProps(targetObj);

        const result = obj.a;

        expect(result).to.equal(1);
    });

    it('should fail to write unexisting prop', () => {
    
        const obj = guardObjectProps({a: 1});

        const result = () => obj.X = 2;

        expect(result).to.throw(
            `Cannot define property X, object is not extensible`);
    });

    it('should NOT fail to write existing prop', () => {

        const obj = guardObjectProps({a: 1});

        obj.a = 2;

        expect(obj.a).to.equal(2);
    });

    it('should fail to write prototype prop', () => {

        const proto = {a: 1};
        const targetObj = Object.create(proto);

        const obj = guardObjectProps(targetObj);

        const result = () => obj.a = 2;
        
        expect(result).to.throw(
            `Cannot define property a, object is not extensible`);
    });

    it('should NOT create proxy in prod environment', () => {

        // setup
        const prevEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        // target
        const obj = guardObjectProps({});

        // check
        const result = () => obj.X;
        expect(result).to.not.throw();

        // teardown
        process.env.NODE_ENV = prevEnv;
    });

    it('should NOT fail to read existing symbol prop', () => {

        const symbol = Symbol('sym');
        const obj = guardObjectProps({[symbol]: 1});
        
        const result = obj[symbol];

        expect(result).to.equal(1);
    });

    it('should fail to read unexisting symbol prop', () => {
        
        const symbol = Symbol('sym');
        const obj = guardObjectProps({});

        expect(() => obj[symbol]).to.throw(
            `Failed to read unexisting property 'Symbol(sym)'`);
    });

});