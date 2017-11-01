import {expect} from 'test/utils';

import guardObjectProps from 'src/utils/guard-object-props';

describe('guard-object-props', () => {

    it('should fail on read from unexisting prop', () => {

        const obj = guardObjectProps({a: 1});

        const result = () => obj.X;

        expect(result).to.throw(`Failed to read unexisting property 'X'`);
    });

    it('should NOT fail on read from existing prop', () => {

        const obj = guardObjectProps({a: 1});

        const result = obj.a;

        expect(result).to.equal(1);
    });

    it('should NOT fail on read from prototype prop', () => {

        const proto = {a: 1};
        const targetObj = Object.create(proto);

        const obj = guardObjectProps(targetObj);

        const result = obj.a;

        expect(result).to.equal(1);
    });

    it('should fail on write to unexisting prop', () => {
    
        const obj = guardObjectProps({a: 1});

        const result = () => obj.X = 2;

        expect(result).to.throw(
            `Cannot define property X, object is not extensible`);
    });

    it('should NOT fail on write to existing prop', () => {

        const obj = guardObjectProps({a: 1});

        obj.a = 2;

        expect(obj.a).to.equal(2);
    });

    it('should fail on write to prototype prop', () => {

        const proto = {a: 1};
        const targetObj = Object.create(proto);

        const obj = guardObjectProps(targetObj);

        const result = () => obj.a = 2;
        
        expect(result).to.throw(
            `Cannot define property a, object is not extensible`);
    });

    it('should not create proxy in prod environment', () => {

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

});