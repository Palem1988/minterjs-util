import { Buffer } from 'safe-buffer';
import {toBuffer as ethToBuffer, privateToAddress as ethPrivateToAddress} from 'ethereumjs-util';

/**
 * Replace Minter prefixes with hex prefix
 * @param {string} value
 */
export function mPrefixToHex(value) {
    return value.replace(/^(Mx|Mp|Mt|Mc|Mh)/, '0x');
}

/**
 * Strip Minter prefixes
 * @param {string} value
 */
export function mPrefixStrip(value) {
    return value.replace(/^(Mx|Mp|Mt|Mc|Mh)/, '');
}

/**
 * Converts Minter prefixed hex string to Buffer
 * @param {string} value
 * @return {Buffer}
 */
export function mToBuffer(value) {
    if (typeof value !== 'string') {
        throw new Error('Type error: string expected');
    }
    if (!isMinterPrefixed(value)) {
        throw new Error('Not minter prefixed');
    }
    value = mPrefixStrip(value);

    return Buffer.from(value, 'hex');
}

/**
 * Attempts to turn a value into a `Buffer`.
 * Supports Minter prefixed hex strings.
 * Otherwise use `ethereumjs-util.toBuffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.
 * @param {*} value
 * @return {Buffer}
 */
export function toBuffer(value) {
    if (typeof value === 'string' && isMinterPrefixed(value)) {
        return mToBuffer(value);
    }

    return ethToBuffer(value);
}

/**
 * Returns the Minter style address string of a given private key
 * @param {Buffer} privateKey A private key must be 256 bits wide
 * @return {string}
 */
export function privateToAddressString(privateKey) {
    return `Mx${ethPrivateToAddress(privateKey).toString('hex')}`;
}

export function isMinterPrefixed(value) {
    return /^(Mx|Mp|Mt|Mc|Mh)[0-9a-fA-F]+$/.test(value);
}

/**
 * Checks only prefix, length and hex body.
 * Don't check secp256k1 curve.
 * @param {string} publicKey
 * @return {boolean}
 */
export function isValidPublicKeyString(publicKey) {
    return /^Mp[0-9a-fA-F]{64}$/.test(publicKey);
}

export function isValidAddress(address) {
    return /^Mx[0-9a-fA-F]{40}$/.test(address);
}

export function isValidCheck(check) {
    return /^Mc[0-9a-fA-F]+$/.test(check);
}

export function isValidTransaction(tx) {
    return /^Mt[0-9a-fA-F]{64}$/.test(tx);
}
