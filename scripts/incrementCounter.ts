import { NetworkProvider, sleep } from '@ton/blueprint';
import { Counter } from '../wrappers/Counter';
import { Address, toNano } from '@ton/core';

export async function run(provider: NetworkProvider) {
    const counter_contract = provider.open(
        Counter.fromAddress(Address.parse('EQAMmxLvpamkAVsN13mV61_l7HeSClIKDW8-S9PTZTl-5IjO')),
    );
    const count_before = await counter_contract.getRecentCounter();
    console.log('count before', count_before.toString());
    console.log('===============================');

    await counter_contract.send(
        provider.sender(),
        { value: toNano('0.05') },
        { $$type: 'Add', querryId: 0n, amount: 1n },
    );

    let counter_after = await counter_contract.getRecentCounter();
    let attempt = 1;
    while (count_before === counter_after) {
        console.log('attempting');
        await sleep(2000);
        counter_after = await counter_contract.getRecentCounter();
        attempt++;
    }

    console.log('count after', counter_after.toString());
}
