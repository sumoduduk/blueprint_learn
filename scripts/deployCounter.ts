import { toNano } from '@ton/core';
import { Counter } from '../wrappers/Counter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const randomInt = Math.floor(Math.random() * 1_000_000);
    const counter = provider.open(await Counter.fromInit(BigInt(randomInt)));

    await counter.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(counter.address);

    const contract_id = await counter.getId();
    console.log({ contract_id });
    //EQAMmxLvpamkAVsN13mV61_l7HeSClIKDW8-S9PTZTl-5IjO

    // run methods on `counter`
}
