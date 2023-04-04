import { Injectable, OnModuleInit } from '@nestjs/common';
import { pedersen, sign } from 'micro-starknet';
import { Provider, ec, Account, json, Contract, number } from 'starknet';
import * as fs from 'fs';

import { ConfigService } from '../config/config.service';

@Injectable()
export class SignService implements OnModuleInit {
  private myContract: Contract;
  constructor(private readonly config: ConfigService) {}
  onModuleInit() {
    if (!this.config.get('PRIVATEKEY')) return;

    const provider = new Provider({ sequencer: { network: 'goerli-alpha' } });

    const privateKey = this.config.get('PRIVATEKEY');
    const starkKeyPair = ec.getKeyPair(privateKey);
    const accountAddress = this.config.get('ADDRESS');

    const account = new Account(provider, accountAddress, starkKeyPair);

    const contractAddress = this.config.get('CONTRACT');

    const compiledContract = json.parse(
      fs.readFileSync('./out/main.json').toString('ascii'),
    );

    // connect the contract
    this.myContract = new Contract(
      compiledContract.abi,
      contractAddress,
      provider,
    );

    this.myContract.connect(account);
  }

  /**
   *
   * @param address
   * @returns
   */
  async signHash(add: string) {
    // felt to hexToDecimalString

    const addrFelt = number.getDecimalString(add);
    console.log('addrFelt', addrFelt);
    const res = await this.myContract.call('nonce', [
      addrFelt,
      // "2764509738225222730632001221651244256434311306728969895596721352716317423526", //  "0x061ca8353f215aa7cdd07098d95ff0a709d08288849f537a85e85470ed0cf7a6",
    ]);

    console.log('res', res);

    const nonce = Number(res.nonce);

    const hashMsg = pedersen(add, nonce);
    const signature = sign(hashMsg, this.config.get('PRIVATEKEY'));

    console.log('signature', signature);
    return {
      r: signature.r.toString(),
      s: signature.s.toString(),
    };
  }
}
