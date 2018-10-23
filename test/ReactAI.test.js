import React from 'react';
import { ReactAI } from '../src/ReactAI'
import { mount } from 'enzyme';

import {AppInsights} from "applicationinsights-js"

// Setup Jest mocks
jest.mock("applicationinsights-js");
appInsights.downloadAndSetup = jest.fn();

class TestComponent extends React.Component {
    render() {
        return (
            <div>hello world</div>
        );
    }
}

describe('Tracked component', () => {

    let TestComponentWithTracking;
    beforeEach(() => {
        
    });

    it('renders', () => {
        ReactAI.init({instrumentationKey:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx'});
        console.log(AppInsights.downloadAndSetup.mock.calls)
        TestComponentWithTracking = ReactAI.withTracking(TestComponent)

        const mountedComponent = mount(<TestComponentWithTracking />);
        mountedComponent.unmount();
    });

    // it('sends tracked metrics back to AppInsights', () => {
    //     const mountedComponent = mount(<TestComponentWithTracking />);
    //     mountedComponent.unmount();
    // });
})

