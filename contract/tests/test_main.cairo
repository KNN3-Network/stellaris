%lang starknet
from src.main import name
from starkware.cairo.common.uint256 import Uint256
from starkware.cairo.common.cairo_builtins import HashBuiltin
from immutablex.starknet.access.IAccessControl import IAccessControl
from starkware.cairo.common.alloc import alloc

@contract_interface
namespace IERC721 {
    func name() -> (name: felt) {
    }

    func symbol() -> (symbol: felt) {
    }

    func balanceOf(owner: felt) -> (balance: Uint256) {
    }

    func ownerOf(tokenId: Uint256) -> (owner: felt) {
    }

    func safeTransferFrom(from_: felt, to: felt, tokenId: Uint256, data_len: felt, data: felt*) {
    }

    func transferFrom(from_: felt, to: felt, tokenId: Uint256) {
    }

    func approve(to: felt, tokenId: Uint256) {
    }

    func setApprovalForAll(operator: felt, approved: felt) {
    }

    func getApproved(tokenId: Uint256) -> (approved: felt) {
    }

    func isApprovedForAll(owner: felt, operator: felt) -> (isApproved: felt) {
    }
}

@contract_interface
namespace IERC721_Bridgeable {
    func permissionedMint(account: felt) {
    }

    func publicMint(sig: (felt, felt)) {
    }
}

@contract_interface
namespace IMain {
    func setSignerPublicKey(key: felt) {
    }
    func signerPublicKey() -> (key: felt) {
    }

    func nonce(address: felt) -> (nonce: felt) {
    }
}

@contract_interface
namespace IERC721_Token_Metadata {
    func tokenURI(tokenId: Uint256) -> (tokenURI_len: felt, tokenURI: felt*) {
    }

    func setBaseURI(base_token_uri_len: felt, base_token_uri: felt*) {
    }

    func setTokenURI(tokenId: Uint256, tokenURI_len: felt, tokenURI: felt*) {
    }

    func resetTokenURI(tokenId: Uint256) {
    }
}

const NAME = 'test name';
const SYMBOL = 'test';
const OWNER = 123456;

const MOCK_BRIDGE_ADDRESS = 1234567890;

// keys
const A_PUB = 1628448741648245036800002906075225705100596136133912895015035902954123957052;
const B_PUB = 3324833730090626974525872402899302150520188025637965566623476530814354734325;

// Account addresses:
const A = 456;
const B = 789;

@view
func __setup__() {
    %{
        context.contract_address = deploy_contract("./src/main.cairo", 
            [
                ids.NAME, ids.SYMBOL, ids.OWNER
            ]
        ).contract_address
    %}
    return ();
}

@view
func test_get_name{syscall_ptr: felt*, range_check_ptr}() {
    tempvar contract_address;
    %{ ids.contract_address = context.contract_address %}

    let (name) = IERC721.name(contract_address);
    assert NAME = name;
    return ();
}

@view
func test_get_symbol{syscall_ptr: felt*, range_check_ptr}() {
    tempvar contract_address;
    %{ ids.contract_address = context.contract_address %}

    let (symbol) = IERC721.symbol(contract_address);
    assert SYMBOL = symbol;
    return ();
}

@view
func test_setSignerPublicKey{syscall_ptr: felt*, range_check_ptr}() {
    tempvar contract_address;
    %{ ids.contract_address = context.contract_address %}

    %{ stop_prank_callable = start_prank(ids.OWNER, context.contract_address) %}
    IMain.setSignerPublicKey(contract_address, A_PUB);
    %{ stop_prank_callable() %}

    let (nonce) = IMain.signerPublicKey(contract_address);
    assert A_PUB = nonce;
    return ();
}

@view
func test_unauthorized_setSignerPublicKey{syscall_ptr: felt*, range_check_ptr}() {
    tempvar contract_address;
    %{ ids.contract_address = context.contract_address %}

    %{ stop_prank_callable = start_prank(ids.MOCK_BRIDGE_ADDRESS, context.contract_address) %}
    %{ expect_revert(error_message="AccessControl: caller is missing role 0") %}
    IMain.setSignerPublicKey(contract_address, A_PUB);
    %{ stop_prank_callable() %}

    return ();
}

@view
func test_get_nonce{syscall_ptr: felt*, range_check_ptr}() {
    tempvar contract_address;
    %{ ids.contract_address = context.contract_address %}

    let (nonce) = IMain.nonce(contract_address, MOCK_BRIDGE_ADDRESS);

    assert 0 = nonce;
    return ();
}

@view
func test_unauthorized_setTokenURI{syscall_ptr: felt*, range_check_ptr, pedersen_ptr: HashBuiltin*}(
    ) {
    alloc_locals;
    local contract_address;
    %{ ids.contract_address = context.contract_address %}

    let account = 123;
    test_utils.mint_token(contract_address, account);

    let (input_token_uri: felt*) = alloc();
    assert input_token_uri[0] = 'https://ipfs.io/ipfs/this-NFT-h';
    assert input_token_uri[1] = 'as-tokenId-set';

    %{ stop_prank_callable = start_prank(ids.MOCK_BRIDGE_ADDRESS, context.contract_address) %}
    %{ expect_revert(error_message="AccessControl: caller is missing role 0") %}
    IERC721_Token_Metadata.setTokenURI(contract_address, Uint256(1, 0), 2, input_token_uri);
    %{ stop_prank_callable() %}

    return ();
}

@view
func test_setTokenURI{syscall_ptr: felt*, range_check_ptr, pedersen_ptr: HashBuiltin*}() {
    alloc_locals;
    local contract_address;
    %{ ids.contract_address = context.contract_address %}

    let account = 123;
    test_utils.mint_token(contract_address, account);

    let (input_token_uri: felt*) = alloc();
    assert input_token_uri[0] = 'https://ipfs.io/ipfs/this-NFT-h';
    assert input_token_uri[1] = 'as-tokenId-set';

    %{ stop_prank_callable = start_prank(ids.OWNER, context.contract_address) %}
    IERC721_Token_Metadata.setTokenURI(contract_address, Uint256(1, 0), 2, input_token_uri);

    %{ stop_prank_callable() %}

    let (token_uri_len_1, token_uri_1) = IERC721_Token_Metadata.tokenURI(
        contract_address, Uint256(1, 0)
    );
    assert 2 = token_uri_len_1;
    assert input_token_uri[0] = token_uri_1[0];
    assert input_token_uri[1] = token_uri_1[1];
    return ();
}

@view
func test_account_with_minter_role_can_mint_tokens{
    syscall_ptr: felt*, range_check_ptr, pedersen_ptr: HashBuiltin*
}() {
    alloc_locals;
    local contract_address;
    %{ ids.contract_address = context.contract_address %}

    let account = 123;
    test_utils.mint_token(contract_address, account);

    let (balance) = IERC721.balanceOf(contract_address, account);
    assert Uint256(1, 0) = balance;
    return ();
}

@view
func test_account_with_minter_role_can_mint_tokens_twice{
    syscall_ptr: felt*, range_check_ptr, pedersen_ptr: HashBuiltin*
}() {
    alloc_locals;
    local contract_address;
    %{ ids.contract_address = context.contract_address %}

    let account = 123;
    test_utils.mint_token(contract_address, account);

    %{ stop_prank_callable = start_prank(ids.OWNER, context.contract_address) %}
    %{ expect_revert(error_message="Already minted") %}
    IERC721_Bridgeable.permissionedMint(contract_address, account);
    %{ stop_prank_callable() %}

    return ();
}

@view
func test_unauthorized_bridge_address_cannot_call_permissioned_functions{
    syscall_ptr: felt*, range_check_ptr, pedersen_ptr: HashBuiltin*
}() {
    tempvar contract_address;
    %{ ids.contract_address = context.contract_address %}

    let account = 123;

    %{ stop_prank_callable = start_prank(ids.MOCK_BRIDGE_ADDRESS, context.contract_address) %}
    %{ expect_revert(error_message="AccessControl: caller is missing role 93433465781963921833282629") %}
    IERC721_Bridgeable.permissionedMint(contract_address, account);
    %{ stop_prank_callable() %}
    return ();
}

// func test_setSignerPublicKey{syscall_ptr: felt*, range_check_ptr, pedersen_ptr: HashBuiltin*}() {
//     tempvar contract_address;
//     %{ ids.contract_address = context.contract_address %}

// let account = 123;

// let private_key = 12345;
//     let public_key = private_to_stark_key(private_key);

// let signature = sign(msg_hash=message_hash, priv_key=private_key);
//     // print(f'Public key: {public_key}');
//     // print(f'Signature: {signature}');

// %{ stop_prank_callable = start_prank(ids.owner, context.contract_address) %}
//     IMain.setSignerPublicKey(contract_address, public_key);
//     %{ stop_prank_callable() %}
//     return ();
// }/*
//

@view
func test_publicMint{syscall_ptr: felt*, range_check_ptr, pedersen_ptr: HashBuiltin*}() {
    alloc_locals;
    local contract_address;
    %{ ids.contract_address = context.contract_address %}

    %{ stop_prank_callable = start_prank(ids.OWNER, context.contract_address) %}
    IMain.setSignerPublicKey(contract_address, A_PUB);
    %{ stop_prank_callable() %}

    local signature_a_1;
    local signature_a_2;

    let (nonce) = IMain.nonce(contract_address, OWNER);

    %{
        stop_prank_callable = start_prank(ids.A, context.contract_address)
        from starkware.crypto.signature.signature import (
            pedersen_hash, private_to_stark_key, sign)
        private_key = 12345
        print(f'Private key: {private_key}')
        public_key = private_to_stark_key(private_key)
        print(f'Public key: {public_key}')
        message_hash = pedersen_hash(ids.A,ids.nonce)
        ids.signature_a_1, ids.signature_a_2 = sign(message_hash, private_key)
    %}

    IERC721_Bridgeable.publicMint(contract_address, sig=(signature_a_1, signature_a_2));

    %{ stop_prank_callable() %}

    let (balance) = IERC721.balanceOf(contract_address, A);
    assert Uint256(1, 0) = balance;
    return ();
}

@view
func test_account_with_admin_role_can_set_base_uri{
    syscall_ptr: felt*, range_check_ptr, pedersen_ptr: HashBuiltin*
}() {
    alloc_locals;
    local contract_address;
    %{ ids.contract_address = context.contract_address %}

    let account = 123;
    let (base_uri: felt*) = alloc();
    assert base_uri[0] = 'https://ipfs.io/ipfs/this-is-a-';
    assert base_uri[1] = 'reasonable-sized-base-uri-set-b';
    assert base_uri[2] = 'y-the-owner/';

    test_utils.mint_token(contract_address, account);

    %{ stop_prank_callable = start_prank(ids.OWNER, context.contract_address) %}
    IERC721_Token_Metadata.setBaseURI(contract_address, 3, base_uri);
    %{ stop_prank_callable() %}

    let (token_uri_len, token_uri) = IERC721_Token_Metadata.tokenURI(
        contract_address, Uint256(1, 0)
    );
    assert 4 = token_uri_len;
    assert base_uri[0] = token_uri[0];
    assert base_uri[1] = token_uri[1];
    assert base_uri[2] = token_uri[2];
    assert '1' = token_uri[3];
    return ();
}

namespace test_utils {
    func mint_token{syscall_ptr: felt*, range_check_ptr, pedersen_ptr: HashBuiltin*}(
        contract_address: felt, to: felt
    ) {
        %{ stop_prank_callable = start_prank(ids.OWNER, context.contract_address) %}
        IAccessControl.grantRole(contract_address, 'MINTER_ROLE', OWNER);
        IERC721_Bridgeable.permissionedMint(contract_address, to);
        %{ stop_prank_callable() %}
        return ();
    }
}
