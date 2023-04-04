// SPDX-License-Identifier: Apache 2.0
// Immutable Cairo Contracts v0.3.0 (erc2981/unidirectional_mutable.cairo)

// This is a uni-directional mutable implementation of EIP2981, meaning that royalty fee amounts are
// defined in the initialization and can only be modified to be reduced, not increased. Royalty
// recipients can still be changed without restrictions. The contract-wide royalty info is set upon
// initialization, and token royalties can only be set to a fee amount less than the default royalty
// if not yet set.

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
func ERC2981_UniDirectional_Mutable_default_royalty_info() -> (default_royalty_info: RoyaltyInfo) {
}

@storage_var
func ERC2981_UniDirectional_Mutable_token_royalty_info(token_id: Uint256) -> (
    token_royalty_info: RoyaltyInfo
) {
}

namespace ERC2981_UniDirectional_Mutable {
    func initializer{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
        receiver: felt, fee_basis_points: felt
    ) {
        ERC165.register_interface(IERC2981_ID);
        with_attr error_message(
                "ERC2981_UniDirectional_Mutable: fee_basis_points exceeds fee denominator (10000)") {
            assert_le_felt(fee_basis_points, FEE_DENOMINATOR);
        }

        ERC2981_UniDirectional_Mutable_default_royalty_info.write(
            RoyaltyInfo(receiver, fee_basis_points)
        );
        return ();
    }

    func royalty_info{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
        token_id: Uint256, sale_price: Uint256
    ) -> (receiver: felt, royalty_amount: Uint256) {
        alloc_locals;
        with_attr error_message("ERC2981_UniDirectional_Mutable: token_id is not a valid Uint256") {
            uint256_check(token_id);
        }

        let (royalty) = ERC2981_UniDirectional_Mutable_token_royalty_info.read(token_id);
        if (royalty.receiver == 0) {
            let (royalty) = ERC2981_UniDirectional_Mutable_default_royalty_info.read();
        }

        local royalty: RoyaltyInfo = royalty;
        tempvar syscall_ptr = syscall_ptr;
        tempvar pedersen_ptr = pedersen_ptr;

        // royalty_amount = sale_price * fee_basis_points / 10000
        let (x: Uint256) = SafeUint256.mul(sale_price, Uint256(royalty.fee_basis_points, 0));
        let (royalty_amount: Uint256, _) = SafeUint256.div_rem(x, Uint256(FEE_DENOMINATOR, 0));

        return (royalty.receiver, royalty_amount);
    }

    // This function should not be used to calculate the royalty amount and simply exposes royalty info for display purposes.
    // Use ERC2981_UniDirectional_Mutable_royaltyInfo to calculate royalty fee amounts for orders as per EIP2981.
    func get_default_royalty{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
        receiver: felt, fee_basis_points: felt
    ) {
        let (royalty) = ERC2981_UniDirectional_Mutable_default_royalty_info.read();
        return (royalty.receiver, royalty.fee_basis_points);
    }

    func set_default_royalty{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
        receiver: felt, fee_basis_points: felt
    ) {
        let (curr_royalty_info) = ERC2981_UniDirectional_Mutable_default_royalty_info.read();
        with_attr error_message(
                "ERC2981_UniDirectional_Mutable: new fee_basis_points exceeds current fee_basis_points") {
            assert_le_felt(fee_basis_points, curr_royalty_info.fee_basis_points);
        }
        ERC2981_UniDirectional_Mutable_default_royalty_info.write(
            RoyaltyInfo(receiver, fee_basis_points)
        );
        return ();
    }

    func reset_default_royalty{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
        ERC2981_UniDirectional_Mutable_default_royalty_info.write(RoyaltyInfo(0, 0));
        return ();
    }

    // If a token royalty for a token is set then it takes precedence over (overrides) the default royalty
    func set_token_royalty{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
        token_id: Uint256, receiver: felt, fee_basis_points: felt
    ) {
        alloc_locals;
        with_attr error_message("ERC2981_UniDirectional_Mutable: token_id is not a valid Uint256") {
            uint256_check(token_id);
        }

        let (curr_royalty_info) = ERC2981_UniDirectional_Mutable_token_royalty_info.read(token_id);
        if (curr_royalty_info.receiver == 0) {
            let (curr_royalty_info) = ERC2981_UniDirectional_Mutable_default_royalty_info.read();
        }
        with_attr error_message(
                "ERC2981_UniDirectional_Mutable: new fee_basis_points exceeds current fee_basis_points") {
            assert_le_felt(fee_basis_points, curr_royalty_info.fee_basis_points);
        }
        ERC2981_UniDirectional_Mutable_token_royalty_info.write(
            token_id, RoyaltyInfo(receiver, fee_basis_points)
        );
        return ();
    }

    func reset_token_royalty{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
        token_id: Uint256
    ) {
        with_attr error_message("ERC2981_UniDirectional_Mutable: token_id is not a valid Uint256") {
            uint256_check(token_id);
        }
        ERC2981_UniDirectional_Mutable_token_royalty_info.write(token_id, RoyaltyInfo(0, 0));
        return ();
    }
}
