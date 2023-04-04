/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ethers } from 'ethers';
import { ConfigService } from '../config/config.service';
import { Prisma } from '@prisma/client';
const SID = require('@siddomains/sidjs').default;
const SIDfunctions = require('@siddomains/sidjs');

@Injectable()
export class CheckService {
  sid;
  provider;
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.provider = new ethers.providers.JsonRpcProvider(
      `https://mainnet.infura.io/v3/${this.config.get('ETHERS')}`,
    );
    const bnbProvider = new ethers.providers.JsonRpcProvider(
      `https://bsc-dataseed.binance.org`,
    );
    const chainId = '56';
    this.sid = new SID({
      provider: bnbProvider,
      sidAddress: SIDfunctions.getSidAddress(chainId),
    });
    this.sid
      .getName('0x88520C10ad3d35aD2D3220CdE446CcB33f09331B')
      .then((name) => {
        console.log(
          'name: %s, address: 0x88520C10ad3d35aD2D3220CdE446CcB33f09331B',
          name,
        );
      });
  }

  async checkEnsOrBnb(addresses: string[]) {
    for (const address of addresses) {
      const bnb = await this.sid.getName(address);
      console.log(
        '🚀 ~ file: check.service.ts:42 ~ CheckService ~ checkEnsOrBnb ~ bnb:',
        bnb,
      );
      if (bnb) return true;
      const ens = await this.provider.lookupAddress(
        address.toLocaleLowerCase(),
      );
      if (ens) return true;
    }
    return false;
  }

  async checkNFT(addresses: string[]) {
    const res = (await this.prisma
      .$queryRaw`select * from nft_hold_view where address in (${Prisma.join(
      addresses,
    )}) and count>0 limit 1 `) as any;
    if (res.length > 0) return true;
    return false;
  }

  async checkBAB(addresses: string[]) {
    const result = await this.prisma.bsc_bab.findFirst({
      where: {
        address: {
          in: addresses.map((address) => address.toLocaleLowerCase()),
        },
      },
    });
    return result ? true : false;
  }

  async checkLens(addresses: string[]) {
    const result = await this.prisma.polygon_lens_profileNFT.findFirst({
      where: { address: { in: addresses } },
    });
    return result ? true : false;
  }

  async check(addresses: string[]) {
    const babCheck = await this.checkBAB(addresses);
    const ensOrBnbCheck = await this.checkEnsOrBnb(addresses);
    const nftCheck = await this.checkNFT(addresses);
    const lensCheck = await this.checkLens(addresses);
    return {
      babCheck,
      ensOrBnbCheck,
      nftCheck,
      lensCheck,
    };
  }
}
