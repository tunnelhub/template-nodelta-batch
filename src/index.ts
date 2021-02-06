import { AutomationExecution, IntegrationMessageReturn, Metadata } from "@4success/tunnelhub-sdk";
import { NoDeltaBatchIntegrationFlow } from "@4success/tunnelhub-sdk/classes/flows/noDeltaBatchIntegrationFlow";
import { ProxyResult } from "aws-lambda";
import got from 'got';
import {Parser} from 'json2csv';
import * as ftp from "basic-ftp";
import {Readable} from "stream";

type CovidCases = {
    stateName: string;
    confirmed: number;
    recovered: number;
    deaths: number;
    updated: string
};

export const handler = async (event: any): Promise<ProxyResult> => {
    const execution = new Integration(event);
    await AutomationExecution.executeAutomation(execution);

    if (execution.hasAnyErrors()) {
        throw Error('Error!');
    }
    return {
        statusCode: 200,
        body: "Automation executed with no errors!"
    };
}


class Integration extends NoDeltaBatchIntegrationFlow {
    private systems: any[];

    constructor(event: any) {
        super(event);
        this.systems = event.systems ?? [];
    }

    /**
     * Return the columns visible in monitoring
     */
    defineMetadata(): Metadata[] {
        return [
            {
                fieldName: 'stateName',
                fieldLabel: 'State name',
                fieldType: 'TEXT',
            },
            {
                fieldName: 'confirmed',
                fieldLabel: 'Confirmed cases',
                fieldType: 'NUMBER',
            },
            {
                fieldName: 'recovered',
                fieldLabel: 'Recovered cases',
                fieldType: 'NUMBER',
            },
            {
                fieldName: 'deaths',
                fieldLabel: 'Deaths',
                fieldType: 'NUMBER',
            },
            {
                fieldName: 'updated',
                fieldLabel: 'Last updated at',
                fieldType: 'DATETIME',
            },
        ]
    }

    /**
     * Return the source system data as a plain array of objets
     * 
     * @param payload 
     */
    async loadSourceSystemData(payload?: any): Promise<CovidCases[]> {
        /**
         * You can get credentials form associated systems with:
         * const system = this.systems.find(value => value.internalName === 'INTERNAL_SYSTEM_NAME');
         */
        const sourceSystemData: CovidCases[] = [];
        const gotResponse = await got(`https://covid-api.mmediagroup.fr/v1/cases?ab=BR`);

        const covidCases = JSON.parse(gotResponse.body);
        for (const state in covidCases) {
            if (state === 'All') {
                continue;
            }
            sourceSystemData.push({
                stateName: state,
                confirmed: covidCases[state].confirmed,
                recovered: covidCases[state].recovered,
                deaths: covidCases[state].deaths,
                updated: covidCases[state].updated
            });
        }

        return sourceSystemData
    }

    /**
     * This routine will be responsible to process your extracted items.
     * Here is up to you, do your magic :)
     * 
     * @param items 
     */
    async sendDataInBatch(items: CovidCases[]): Promise<IntegrationMessageReturn> {
        /**
         * You can get credentials form associated systems with:
         * const system = this.systems.find(value => value.internalName === 'INTERNAL_SYSTEM_NAME');
         */
        const props = Object.keys(items[0]);
        const opts = {fields: props};

        const parser = new Parser(opts);

        const client = new ftp.Client();
        await client.access({
            host: 'your.ftp.host.com',
            port: 21,
            user: 'yourUser',
            password: 'yourPassword',
            secure: false,        
        })

        const readable = Readable.from([parser.parse(items)]);
        await client.uploadFrom(readable, `/destinationFolder/covidcases/${Math.floor(Date.now() / 1000)}/extractedData.csv`);
        client.close()

        return {
            data: {},
            message: 'Success'
        }
    }
}
