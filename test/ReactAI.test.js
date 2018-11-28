// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import { ReactAI } from '../src/ReactAI';
import { mount } from 'enzyme';

import { AppInsights } from 'applicationinsights-js';

import createHistory from 'history/createBrowserHistory'

const INNER_TEXT = Math.random()
  .toString(36)
  .substring(7);
let INIT_SETTINGS = {
  instrumentationKey: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx',
};

class TestComponent extends React.Component {
  render() {
    return <div>{INNER_TEXT}</div>;
  }
}

describe('Tracked component', () => {
  beforeEach(() => {
    jest.mock('applicationinsights-js');
    appInsights.downloadAndSetup = jest.fn();
    appInsights.trackMetric = jest.fn();
    appInsights.trackPageView = jest.fn();
  });

  it('renders correctly', () => {
    ReactAI.init(INIT_SETTINGS);
    let TestComponentWithTracking = ReactAI.withTracking(TestComponent);

    const mountedComponent = mount(<TestComponentWithTracking />);
    expect(mountedComponent.html()).toEqual('<div>' + INNER_TEXT + '</div>');

    mountedComponent.unmount();
    // TODO test that it's unmounted?
  });

  it('sends tracked metrics back to AppInsights', () => {
    ReactAI.init(INIT_SETTINGS);
    expect(AppInsights.downloadAndSetup.mock.calls.length).toEqual(2);
    expect(AppInsights.downloadAndSetup.mock.calls[0]).toEqual([INIT_SETTINGS]);

    let TestComponentWithTracking = ReactAI.withTracking(TestComponent);
    const mountedComponent = mount(<TestComponentWithTracking />);
    expect(AppInsights.trackMetric.mock.calls.length).toEqual(0);

    mountedComponent.unmount();
    expect(AppInsights.trackMetric.mock.calls.length).toEqual(1);
    expect(AppInsights.trackMetric.mock.calls[0][0]).toEqual('React Component Engaged Time (seconds)');
    expect(AppInsights.trackMetric.mock.calls[0][1]).toBeLessThan(2);
    expect(AppInsights.trackMetric.mock.calls[0][2]).toEqual(1);
    expect(AppInsights.trackMetric.mock.calls[0][3]).toBeNull();
    expect(AppInsights.trackMetric.mock.calls[0][4]).toBeNull();
    expect(JSON.stringify(AppInsights.trackMetric.mock.calls[0][5])).toEqual('{"Component Name":"TestComponent"}');
  });

  it('tracks page views', () => {
    const history = createHistory()
    ReactAI.init(INIT_SETTINGS, history);

    history.push("/home", { some: "state" });
    history.push("/new-fancy-page");
    expect(AppInsights.trackPageView.mock.calls.length).toEqual(2);
  })
});
