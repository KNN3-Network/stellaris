// SPDX-License-Identifier: Apache 2.0
// Immutable Cairo Contracts v0.3.0 (token/erc721/presets/ERC721_Full.cairo)

// ERC721_Full.cairo has behaviour:
// - ERC721, TokenMetadata, ContractMetadata, AccessControl, Royalty, Bridgeable

%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin, SignatureBuiltin
from starkware.cairo.common.uint256 import Uint256
from starkware.cairo.common.bool import TRUE, FALSE
from starkware.starknet.common.syscalls import get_caller_address
from starkware.cairo.common.signature import verify_ecdsa_signature
from starkware.cairo.common.hash import hash2

from openzeppelin.introspection.erc165.library import ERC165
from openzeppelin.access.accesscontrol.library import AccessControl
from openzeppelin.security.reentrancyguard.library import ReentrancyGuard

from immutablex.starknet.token.erc721.library import ERC721
from immutablex.starknet.token.erc721_token_metadata.library import ERC721_Token_Metadata
from immutablex.starknet.token.erc721_contract_metadata.library import ERC721_Contract_Metadata

//
// Constants
//

const MINTER_ROLE = 'MINTER_ROLE';
const DEFAULT_ADMIN_ROLE = 0x00;

//
// Constructor
//

@constructor
func constructor{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    name: felt, symbol: felt, owner: felt
) {
    ERC721.initializer(name, symbol);
    ERC721_Token_Metadata.initializer();
    AccessControl.initializer();
    AccessControl._grant_role(DEFAULT_ADMIN_ROLE, owner);
    return ();
}

@event
func SetPublicKey(key: felt) {
}

// Total supply
@storage_var
func Total_Supply() -> (supply: felt) {
}

// Address has minted
@storage_var
func Address_Has_Minted(address: felt) -> (state: felt) {
}

@storage_var
func Nonces(address: felt) -> (nonce: felt) {
}

@storage_var
func Signer_Public_Key() -> (key: felt) {
}

@external
func setSignerPublicKey{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    key: felt
) {
    AccessControl.assert_only_role(DEFAULT_ADMIN_ROLE);
    Signer_Public_Key.write(key);

    SetPublicKey.emit(key);
    return ();
}

@view
func signerPublicKey{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
    key: felt
) {
    let (key) = Signer_Public_Key.read();
    return (key,);
}

@view
func totalSupply{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
    supply: felt
) {
    let (supply) = Total_Supply.read();
    return (supply,);
}

@view
func nonce{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(address: felt) -> (
    nonce: felt
) {
    let (nonce) = Nonces.read(address);
    return (nonce,);
}

//
// View (ERC165)
//

@view
func supportsInterface{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    interfaceId: felt
) -> (success: felt) {
    let (success) = ERC165.supports_interface(interfaceId);
    return (success,);
}

//
// View (ERC721)
//

@view
func name{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (name: felt) {
    let (name) = ERC721.name();
    return (name,);
}

@view
func symbol{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (symbol: felt) {
    let (symbol) = ERC721.symbol();
    return (symbol,);
}

@view
func balanceOf{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(owner: felt) -> (
    balance: Uint256
) {
    let (balance: Uint256) = ERC721.balance_of(owner);
    return (balance,);
}

@view
func ownerOf{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(tokenId: Uint256) -> (
    owner: felt
) {
    let (owner: felt) = ERC721.owner_of(tokenId);
    return (owner,);
}

//
// View (contract metadata)
//

@view
func contractURI{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
    contract_uri_len: felt, contract_uri: felt*
) {
    let (contract_uri_len, contract_uri) = ERC721_Contract_Metadata.contract_uri();
    return (contract_uri_len, contract_uri);
}

//
// View (token metadata)
//

@view
func tokenURI{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    tokenId: Uint256
) -> (tokenURI_len: felt, tokenURI: felt*) {
    let (tokenURI_len, tokenURI) = ERC721_Token_Metadata.token_uri(tokenId);
    return (tokenURI_len, tokenURI);
}

//
// View (access control)
//

@view
func hasRole{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    role: felt, account: felt
) -> (res: felt) {
    let (res) = AccessControl.has_role(role, account);
    return (res,);
}

@view
func getRoleAdmin{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(role: felt) -> (
    role_admin: felt
) {
    let (role_admin) = AccessControl.get_role_admin(role);
    return (role_admin,);
}

@view
func getMinterRole{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
    res: felt
) {
    return (MINTER_ROLE,);
}

//
// Externals (ERC721)
//

//
// External (token metadata)
//

@external
func setBaseURI{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(
    base_token_uri_len: felt, base_token_uri: felt*
) {
    AccessControl.assert_only_role(DEFAULT_ADMIN_ROLE);
    ERC721_Token_Metadata.set_base_token_uri(base_token_uri_len, base_token_uri);
    return ();
}

@external
func setTokenURI{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(
    tokenId: Uint256, tokenURI_len: felt, tokenURI: felt*
) {
    AccessControl.assert_only_role(DEFAULT_ADMIN_ROLE);
    ERC721_Token_Metadata.set_token_uri(tokenId, tokenURI_len, tokenURI);
    return ();
}

@external
func resetTokenURI{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(
    tokenId: Uint256
) {
    AccessControl.assert_only_role(DEFAULT_ADMIN_ROLE);
    ERC721_Token_Metadata.reset_token_uri(tokenId);
    return ();
}

//
// External (contract metadata)
//

@external
func setContractURI{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(
    contract_uri_len: felt, contract_uri: felt*
) {
    AccessControl.assert_only_role(DEFAULT_ADMIN_ROLE);
    ERC721_Contract_Metadata.set_contract_uri(contract_uri_len, contract_uri);
    return ();
}

//
// External (bridgeable)
//

@external
func permissionedMint{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(
    account: felt
) {
    AccessControl.assert_only_role(MINTER_ROLE);

    let (caller) = get_caller_address();
    let (address_has_minted) = Address_Has_Minted.read(caller);

    with_attr error_message("Already minted") {
        assert address_has_minted = FALSE;
    }

    let (supply) = Total_Supply.read();
    ERC721._mint(account, Uint256(supply, 0));
    Total_Supply.write(supply + 1);
    Address_Has_Minted.write(caller, TRUE);
    return ();
}

@external
func publicMint{
    pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr, ecdsa_ptr: SignatureBuiltin*
}(sig: (felt, felt)) {
    ReentrancyGuard.start();
    
    let (caller) = get_caller_address();
    let (nonce) = Nonces.read(caller);
    let (key) = Signer_Public_Key.read();
    // update nonce
    Nonces.write(caller, value=nonce + 1);

    let (message) = hash2{hash_ptr=pedersen_ptr}(caller, nonce);

    // Verify the user's signature.
    verify_ecdsa_signature(message, public_key=key, signature_r=sig[0], signature_s=sig[1]);

    let (address_has_minted) = Address_Has_Minted.read(caller);

    with_attr error_message("Already minted") {
        assert address_has_minted = FALSE;
    }

    let (supply) = Total_Supply.read();
    ERC721._mint(caller, Uint256(supply, 0));
    Total_Supply.write(supply + 1);
    Address_Has_Minted.write(caller, TRUE);

    ReentrancyGuard.end();
    return ();
}

//
// External (access control)
//

@external
func grantRole{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    role: felt, account: felt
) {
    AccessControl.grant_role(role, account);
    return ();
}

@external
func revokeRole{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    role: felt, account: felt
) {
    AccessControl.revoke_role(role, account);
    return ();
}

@external
func renounceRole{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    role: felt, account: felt
) {
    AccessControl.renounce_role(role, account);
    return ();
}
