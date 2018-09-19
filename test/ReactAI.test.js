import React from 'react';
import { ReactAI } from '../src/ReactAI'
import { mount } from 'enzyme';

// NB: must add applicationinsights-js.js mock empty file to cope with this issue 
// https://github.com/Microsoft/ApplicationInsights-JS/issues/476

class TestComponent extends React.Component {
    render() {
        return (
            <div>hello world</div>
        );
    }
}


describe('tracked component', () => {

    let TestComponentWithTracking;
    beforeEach(() => {
        TestComponentWithTracking = ReactAI.withTracking(TestComponent)
    });

    test('it renders', () => {
        const mountedComponent = mount(<TestComponentWithTracking />);

        mountedComponent.unmount();


    });
})

