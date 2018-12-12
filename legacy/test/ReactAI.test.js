// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import { ReactAI } from '../src/ReactAI';
import { mount } from 'enzyme';

import { AppInsights } from 'applicationinsights-js';

import createHistory from 'history/createBrowserHistory';

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

jest.mock('applicationinsights-js');

describe('ReactAI', () => {
  beforeAll(() => {
    // mock all functions of AppInsights
    for (const key of Object.keys(AppInsights)) {
      if (key != 'queue') AppInsights[key] = jest.fn();
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a tracked component correctly', () => {
    ReactAI.init(INIT_SETTINGS);
    let TestComponentWithTracking = ReactAI.withTracking(TestComponent);

    const mountedComponent = mount(<TestComponentWithTracking />);
    expect(mountedComponent.html()).toEqual('<div>' + INNER_TEXT + '</div>');

    mountedComponent.unmount();
    // TODO test that it's unmounted?
  });

  it('sends metrics of the tracked component back to AppInsights', () => {
    ReactAI.init(INIT_SETTINGS);
    expect(AppInsights.downloadAndSetup).toHaveBeenCalledTimes(2);
    expect(AppInsights.downloadAndSetup).toHaveBeenCalledWith(INIT_SETTINGS);

    let TestComponentWithTracking = ReactAI.withTracking(TestComponent);
    const mountedComponent = mount(<TestComponentWithTracking />);
    expect(AppInsights.trackMetric).toHaveBeenCalledTimes(0);

    mountedComponent.unmount();
    expect(AppInsights.trackMetric).toHaveBeenCalledTimes(1);
    expect(AppInsights.trackMetric).toHaveBeenCalledWith(
      'React Component Engaged Time (seconds)',
      expect.any(Number),
      1,
      null,
      null,
      { 'Component Name': 'TestComponent' },
    );
  });

  it('tracks page views', () => {
    const history = createHistory();
    ReactAI.init(INIT_SETTINGS, history);

    history.push('/home', { some: 'state' });
    history.push('/new-fancy-page');
    expect(AppInsights.trackPageView).toHaveBeenCalledTimes(2);
  });

  it('initializes queue to set appContext', () => {
    ReactAI.init(INIT_SETTINGS);
    var initialQueueLength = AppInsights.queue.length; // Anything from the default {urlReferrer: document.referrer} appContext

    let testContext = {
      prop1text: 'value1',
      prop2number: 100,
      prop3boolean: true,
    };

    ReactAI.setAppContext(testContext);

    AppInsights.trackTrace('Test trace', { prop: 'value' });
    AppInsights.trackDependency('test', 'get', 'https://test/', '/test', 100, true, 200);
    AppInsights.trackEvent('test');

    expect(AppInsights.queue.length).toEqual(initialQueueLength + 1);
    expect(AppInsights.trackTrace).toHaveBeenCalledTimes(1);
    expect(AppInsights.trackDependency).toHaveBeenCalledTimes(1);
    expect(AppInsights.trackEvent).toHaveBeenCalledTimes(1);
    // TODO Ideally, we'd have a way to test the props of the telemetry items to be { ...testContext, suppliedProps } but that requires a lot of refactor
  });
});
