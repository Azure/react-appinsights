const aiMock = jest.genMockFromModule('applicationinsights-js');

aiMock.trackMetric.mockImplementation(track);

function track() {
    console.log('mocking trackMetric');
}

module.export = aiMock;

aiMock.trackMetric.mockImplementation(track);

function track() {
    console.log('mocking trackMetric');
}

module.export = aiMock;