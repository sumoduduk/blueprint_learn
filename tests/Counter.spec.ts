import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Counter } from '../wrappers/Counter';
import '@ton/test-utils';

describe('Counter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let counter: SandboxContract<Counter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        counter = blockchain.openContract(await Counter.fromInit(0n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await counter.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: counter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and counter are ready to use
        const count = await counter.getRecentCounter();
        const id = await counter.getId();
        expect(count).toBe(0n);
        expect(id).toBe(0n);
    });

    it('can incrase counter', async () => {
        for (let i = 0; i < 3; i++) {
            console.log('incrased i = ', i + 1);

            const user = await blockchain.treasury('user');
            console.log('user address', user.address);
            const count_before = await counter.getRecentCounter();
            console.log('count_before', count_before.toString());

            const random_incrase = Math.floor(Math.random() * 100);
            console.log('incrased by : ', random_incrase);

            const incrase_res = await counter.send(
                user.getSender(),
                {
                    value: toNano('0.05'),
                },
                {
                    $$type: 'Add',
                    querryId: 0n,
                    amount: BigInt(random_incrase),
                },
            );

            expect(incrase_res.transactions).toHaveTransaction({
                from: user.address,
                to: counter.address,
                success: true,
            });

            const count_after = await counter.getRecentCounter();
            console.log('count_after : ', count_after.toString());

            expect(count_after).toBe(BigInt(random_incrase) + count_before);
        }
    });
});
