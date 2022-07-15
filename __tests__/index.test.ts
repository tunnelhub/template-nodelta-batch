import { handler } from '../src';
import Integration from '../src/classes/integration';
import * as thSdk from '@4success/tunnelhub-sdk';

jest.mock('../src/classes/integration');
jest.mock('@4success/tunnelhub-sdk');

const mockedSdk = jest.mocked(thSdk, true);

describe('index text', () => {
  mockedSdk.AutomationExecution.executeAutomation.mockImplementation(jest.fn());

  test('success test', async () => {
    const hasAnyErrorsSpy = jest.spyOn(Integration.prototype as any, 'hasAnyErrors');
    hasAnyErrorsSpy.mockImplementationOnce(jest.fn(() => false));

    await expect(handler({}, {})).resolves.not.toThrow();
    expect(hasAnyErrorsSpy).toBeCalled();
  });

  test('error test', async () => {
    const hasAnyErrorsSpy = jest.spyOn(Integration.prototype as any, 'hasAnyErrors');
    hasAnyErrorsSpy.mockImplementationOnce(jest.fn(() => true));

    await expect(handler({}, {})).rejects.toThrow();
    expect(hasAnyErrorsSpy).toBeCalled();
  });

});