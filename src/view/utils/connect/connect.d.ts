// based on react-redux typings
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-redux/index.d.ts

import * as React from 'react';

type ComponentClass<P> = React.ComponentClass<P>;
type Component<P> = React.ComponentType<P>;
type ViewModel = object;

// Diff / Omit taken from https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-311923766
type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

// Injects props and removes them from the prop requirements.
// Will not pass through the injected props if they are passed in during
// render. Also adds new prop requirements from TNeedsProps.
export interface InferableComponentEnhancer<TInjectedProps> {
    <P extends TInjectedProps>(
        component: Component<P>
    ): ComponentClass<Omit<P, keyof TInjectedProps>>
}

interface MapPropsToVM<TOwnProps> {
    (props: TOwnProps): ViewModel;
}

interface MapDispatchToProps<TInjectedProps, TOwnProps> {
    (dispatch: Function, props: TOwnProps): TInjectedProps;
}

// bug (#66): own props will not be staticly checked because its type cannot be
// infered from component props for some reason, unless user explicitly 
// specifies type of own props. but default type is generic 'any' for now.
export interface ConnectFunction {

    <TInjectedProps = {}, TOwnProps = any>(
        mapPropsToVM: MapPropsToVM<TOwnProps>
    ): InferableComponentEnhancer<TInjectedProps>;

    <TInjectedProps = {}, TOwnProps = any>(
        mapPropsToVM: MapPropsToVM<TOwnProps>,
        mapDispatchToProps: MapDispatchToProps<TInjectedProps, TOwnProps>
    ): InferableComponentEnhancer<TInjectedProps>;
}

declare const connect: ConnectFunction;

export default connect;