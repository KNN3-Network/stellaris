// SPDX-License-Identifier: Apache 2.0
// Immutable Cairo Contracts v0.3.0

%lang starknet

from starkware.cairo.common.uint256 import Uint256

@contract_interface
namespace IStandardERC721Bridge {
    func get_l1_bridge() -> (l1_bridge: felt) {
    }

    func get_l1_address(l2_address: felt) -> (l1_address: felt) {
    }

    func set_l1_bridge(l1_bridge_address: felt) {
    }

    func initiate_withdraw(
        l2_token_address: felt, l2_token_ids_len: felt, l2_token_ids: Uint256*, l1_claimant: felt
    ) {
    }
}
