// SPDX-License-Identifier: Apache 2.0
// Immutable Cairo Contracts v0.3.0 (erc2981/immutable.cairo)

// This is an immutable implementation of EIP2981, where the royalty info royalty info is set
// upon initialization and cannot be modified afterwards. Additionally, royalty info can only
// be defined for the entire contract, not individual token IDs.

%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math import assert_not_zero, assert_le_felt
from starkware.cairo.common.uint256 import (
    Uint256,
    uint256_add,
    uint256_le,
    uint256_check,
    uint256_mul,
    uint256_unsigned_div_rem,
)

from openzeppelin.introspection.erc165.library import ERC165
from openzeppelin.security.safemath.library import SafeUint256

from immutablex.starknet.utils.constants import IERC2981_ID

const FEE_DENOMINATOR = 10000;

// The royalty percentage is expressed in basis points
// i.e. fee_basis_points of 123 = 1.23%, 10000 = 100%
struct RoyaltyInfo {
    receiver: felt,
    fee_basis_points: felt,
}

@storage_var
func ERC2981_Immutable_royalty_info() -> (contract_royalty_info: RoyaltyInfo) {
}

namespace ERC2981_Immutable {
    func initializer{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
        receiver: felt, fee_basis_points: felt
    ) {
        ERC165.register_interface(IERC2981_ID);
        _set_contract_royalty(receiver, fee_basis_points);
        return ();
    }

    func royalty_info{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
        token_id: Uint256, sale_price: Uint256
    ) -> (receiver: felt, royalty_amount: Uint256) {
        alloc_locals;
        with_attr error_message("ERC2981: token_id is not a valid Uint256") {
            uint256_check(token_id);
        }

        let (royalty) = ERC2981_Immutable_royalty_info.read();

        // royalty_amount = sale_price * fee_basis_points / 10000
        let (x: Uint256) = SafeUint256.mul(sale_price, Uint256(royalty.fee_basis_points, 0));
        let (royalty_amount: Uint256, _) = SafeUint256.div_rem(x, Uint256(FEE_DENOMINATOR, 0));

        return (royalty.receiver, royalty_amount);
    }

    // This function should not be used to calculate the royalty amount and simply exposes royalty info for display purposes.
    // Use ERC2981_Immutable_royaltyInfo to calculate royalty fee amounts for orders as per EIP2981.
    func get_royalty{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
        receiver: felt, fee_basis_points: felt
    ) {
        let (royalty) = ERC2981_Immutable_royalty_info.read();
        return (royalty.receiver, royalty.fee_basis_points);
    }

    //
    // Internal
    //

    func _set_contract_royalty{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
        receiver: felt, fee_basis_points: felt
    ) {
        with_attr error_message(
                "ERC2981_Immutable: fee_basis_points exceeds fee denominator (10000)") {
            assert_le_felt(fee_basis_points, FEE_DENOMINATOR);
        }

        ERC2981_Immutable_royalty_info.write(RoyaltyInfo(receiver, fee_basis_points));
        return ();
    }
}
