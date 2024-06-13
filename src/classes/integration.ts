import { NoDeltaBatchIntegrationFlow } from '@tunnelhub/sdk/src/classes/flows/noDeltaBatchIntegrationFlow';
import { GenericParameter, IntegrationMessageReturnBatch, Metadata } from '@tunnelhub/sdk';
import { TunnelHubSystem } from '@tunnelhub/sdk/src/types/data';
import { IntegrationModel } from '../types';
import metadata from '../metadata';

export default class Integration extends NoDeltaBatchIntegrationFlow {
  private readonly parameters: { custom: GenericParameter[] };
  private readonly systems: TunnelHubSystem[];

  constructor(event: any, context: any) {
    super(event, context);
    this.systems = event.systems ?? [];
    this.parameters = event.parameters ?? {};
    /**
     * It is mandatory to have the constructor call the super with the event of the main handler.
     * You can get the systems configured in automation and save them in a class attribute for further use.
     */
  }

  /* istanbul ignore next */
  defineMetadata(): Metadata[] {
    /**
     * Return all columns that will be visible on the monitoring screen.
     * The components order is the display order in the monitoring table.
     *
     * The implementation of this method is mandatory
     */
    return metadata;
  }

  async loadSourceSystemData(payload?: any): Promise<IntegrationModel[]> {
    /**
     * Return the source system data as a plain array of objects
     *
     * This is the method where you will extract your source data
     * If your automation is a webhook, the payload sent will be available in the "payload" parameter.
     *
     * The implementation of this method is mandatory
     */
    return [
      {
        key_field: '1',
        regular_field: 'anyString',
      },
      {
        key_field: '2',
        regular_field: 'anotherString',
      },
    ];
  }

  async sendDataInBatch(items: IntegrationModel[]): Promise<IntegrationMessageReturnBatch[]> {
    const responseArray: IntegrationMessageReturnBatch[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      /**
       * This routine will be responsible to process your extracted items.
       * Here is up to you, do your magic :)
       *
       * The implementation of this method is mandatory
       */
      try {
        responseArray.push({
          status: 'SUCCESS',
          data: {},
          message: 'Send successfully',
        });
      } catch (e) {
        responseArray.push({
          status: 'FAIL',
          data: {},
          message: e.message,
        });
      }
    }
    return responseArray;
  }
}