import { mocked } from 'ts-jest/utils';
import * as main from '../src';
import * as ftp from 'basic-ftp';
import { NoDeltaBatchIntegrationFlow } from '@4success/tunnelhub-sdk/src/classes/flows/noDeltaBatchIntegrationFlow';
import got from 'got';

jest.mock('basic-ftp');
jest.mock('got');

const mockedFtp = mocked(ftp, true);
const mockedGot = mocked(got, true);

beforeAll(() => {
  /**
   * The code bellow is ** mandatory ** to avoid TunnelHub SDK make external calls trying persist logs
   * You can make this mock using the same code with any IntegrationFlow at @4success/tunnelhub-sdk/classes/flows
   */
  const persistLogsFunc = jest.spyOn(NoDeltaBatchIntegrationFlow.prototype as any, 'persistLogs');
  persistLogsFunc.mockImplementation(() => {
  });

  const updateExecutionStatisticsFunc = jest.spyOn(NoDeltaBatchIntegrationFlow.prototype as any, 'updateExecutionStatistics');
  updateExecutionStatisticsFunc.mockImplementation(() => {
  });

  const updateMetadata = jest.spyOn(NoDeltaBatchIntegrationFlow.prototype as any, 'updateMetadata');
  updateMetadata.mockImplementation(() => {
  });
});


test('testMyIntegration', async () => {
  /***
   * Mocking basic-ftp class and got
   */
  //@ts-ignore - is not necessary return all methods
  mockedFtp.Client.mockImplementation(() => {
    return {
      access(options) {
        //@ts-ignore
        return new Promise(resolve => resolve({}));
      },
      uploadFrom(source, toRemotePath, options) {
        return new Promise(resolve => {
          //@ts-ignore
          resolve({});
        });
      },
      close() {
      },
    };
  });

  //@ts-ignore - is not necessary return all methods
  mockedGot.mockReturnValue({ body: JSON.stringify(require('./data/covidCases.json')) });

  /**
   * Calling my function
   */
  const response = await main.handler({}, {});

  expect(response.statusCode).toEqual(200);
  expect(typeof response.body).toBe('string');

  expect(response.body).toEqual('Automation executed with no errors!');
});