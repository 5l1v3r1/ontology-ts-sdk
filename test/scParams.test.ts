import { PrivateKey } from '../src/crypto/PrivateKey';
import { RestClient, Struct } from '../src/index';
import { WebsocketClient } from '../src/network/websocket/websocketClient';
import { num2hexstring, reverseHex, str2hexstr } from '../src/utils';
import { Account } from './../src/account';
import { Address } from './../src/crypto/address';
import { Parameter, ParameterType } from './../src/smartcontract/abi/parameter';
import { makeInvokeTransaction, signTransaction } from './../src/transaction/transactionBuilder';

describe('test smarct contract params', () => {
    const socketClient = new WebsocketClient();

    const privateKey = new PrivateKey('7c47df9664e7db85c1308c080f398400cb24283f5d922e76b478b5429e821b93');
    const account = Account.create(privateKey, '123456', 'test');
    console.log(account.address.serialize());
    test('test params Array', async () => {
        const contract = reverseHex('f7bafc05ad1fc3822a1db1d195c7dc02959f073e');
        const contractAddr = new Address(contract);
        const method = 'TransferMulti';
        const from = new Address('AMxBvXdVasM1WApTS3ViCU9V8hiXYa4437');
        const to = new Address('AWyZRDzFp3c53VTLdyD1Z31gB4bUo8ojN4').serialize();
        const to2 = new Address('AQGkPm8KqQi4rRbhXX9N6FyjRSawtGwfUf').serialize();
        const amount = 100;

        const params = [
            new Parameter('args', ParameterType.Array,
                [
                    from.serialize(),
                    to,
                    100
                ]
            ),
            new Parameter('args', ParameterType.Array,
                [
                    from.serialize(),
                    to,
                    100
                ]
            )

        ];
        // const tx = makeInvokeTransaction(method, params, contractAddr, '500', '20000', from);
        // const pri = PrivateKey.deserializeWIF('KxRfVFzS6Wm3mAy8h1txuhRzkudN8j2kWAKdjs9FVptCx54HLL7r');
        // signTransaction(tx, pri);
        // const res = await socketClient.sendRawTransaction(tx.serialize(), false, true);
        // console.log(JSON.stringify(res));

        const tx = makeInvokeTransaction('BalanceOf', [], contractAddr, '500', '20000');
        const res = await socketClient.sendRawTransaction(tx.serialize(), true, false);
        console.log(JSON.stringify(res));
    }, 10000);

    test('exchange', async () => {
        const contract = '7dffd39e53be06f104f443857f9115ec55212b43';
        const contractAddr = new Address(reverseHex(contract));
        const method = 'Exchange';
        const parameters = [
            new Parameter('from', ParameterType.ByteArray, 'fb0948cc37048b785c2f1e5056632794ece84af4'),
            new Parameter('to', ParameterType.ByteArray, 'a6bfa95fae5a7c50b6ae63ffed44eb94106393fe'),
            new Parameter('fromSymbol', ParameterType.String, 'Token1'),
            new Parameter('toSymbol', ParameterType.String, 'Token2'),
            new Parameter('value', ParameterType.Integer, 10)
        ];
        const tx = makeInvokeTransaction(method, parameters, contractAddr, '500', '20000');
        const res = await socketClient.sendRawTransaction(tx.serialize(), true, false);
        console.log(JSON.stringify(res));
    });

    test('fomo3dBuy', async () => {
        console.log('hex: ' +str2hexstr(''));
        const contract = '9361fc1e3a628e1aa46b3d58dde051530f0f5aa0';
        const contractAddr = new Address(reverseHex(contract));
        const method = 'Buy';
        const parameters = [
            new Parameter('playerAddr', ParameterType.ByteArray, account.address.toHexString()),
            new Parameter('amountInCoin', ParameterType.Int, 150314570501736060),
            new Parameter('team', ParameterType.Int, 1),
            new Parameter('useVault', ParameterType.Boolean, false),
            new Parameter('referrer', ParameterType.String, '')
        ];
        const tx = makeInvokeTransaction(method, parameters, contractAddr, '500', '20000');
        signTransaction(tx, privateKey);
        const res = await socketClient.sendRawTransaction(tx.serialize(), false, true);
        console.log(JSON.stringify(res));
    });

    test('getCurrentRound', async () => {
        const contract = 'dedc8c61d03dcc3387737fbddbe8096300be84de';
        const contractAddr = new Address(reverseHex(contract));
        const method = 'getCurrentRound';
        const tx = makeInvokeTransaction(method, [], contractAddr);
        const res = await socketClient.sendRawTransaction(tx.serialize(), true);
        console.log(res);
    });

    test('checkNumber', async () => {
        const contract = reverseHex('9e092590a023a0a7519a56a37c0c2a8deea27e73');
        const contractAddr = new Address(contract);

        const params = [
            new Parameter('args', ParameterType.Array,
                [
                    18, 33, 5139, 12849, 2368291, 3551794, 353637396, 1178681665, 94842983701,
                    353551602001, 43044802274854, 114771766698594,
                    new Parameter('', ParameterType.Long, '14978884054759223'),
                    new Parameter('', ParameterType.Long, '32778036993815411')
                ]
            )

        ];

        const tx = makeInvokeTransaction('checkNumberList', params, contractAddr);
        const rest = new RestClient();
        const res = await rest.sendRawTransaction(tx.serialize(), true);
        console.log(JSON.stringify(res));
    }, 10000);

});

