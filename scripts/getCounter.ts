import { NetworkProvider } from '@ton/blueprint';
import { Counter } from '../wrappers/Counter';
import { Address } from '@ton/core';

export async function run(provider: NetworkProvider) {
    const counter_contract = provider.open(
        Counter.fromAddress(Address.parse('EQAMmxLvpamkAVsN13mV61_l7HeSClIKDW8-S9PTZTl-5IjO')),
    );
    const count_recent = await counter_contract.getRecentCounter();
    console.log('count recent', count_recent.toString());
}
