// @flow
import config from '../config.json';
import Crypto from '../security/Crypto';
import HttpClient from '../http/HttpClient';
import KeyStoreCryptoEngine from '../security/engines/KeyStoreCryptoEngine';
import MemoryCryptoEngine from '../security/engines/MemoryCryptoEngine';
import ManualCryptoEngine from '../security/engines/ManualCryptoEngine';
import Util from '../Util';
import type {
    Alias,
    Bank,
    Paging,
    TokenMember,
} from '..';

/**
 * Token SDK entry point.
 */
export class TokenClient {
    options: Object;
    KeyLevel: Object;
    Crypto: Crypto;
    MemoryCryptoEngine: Class<MemoryCryptoEngine>;
    ManualCryptoEngine: Class<MemoryCryptoEngine>;
    Util: Util;
    _unauthenticatedClient: HttpClient;

    constructor(options: {
        // Token environment to target, defaults to 'prd'
        env?: string,
        // dev key
        developerKey?: string,
        // callback to invoke on any cross-cutting RPC
        globalRpcErrorCallback?: ({name: string, message: string}) => void,
        // enable HTTP error logging if true
        loggingEnabled?: boolean,
        // custom API URL to override the default
        customSdkUrl?: string,
        // custom HTTP response interceptor for axios
        customResponseInterceptor?: Object,
    } = {}) {
        this.options = options;
        this.KeyLevel = config.KeyLevel;
        this.Crypto = Crypto;
        this.MemoryCryptoEngine = MemoryCryptoEngine;
        this.ManualCryptoEngine = ManualCryptoEngine;
        this.Util = Util;
    }

    /**
     * Resolve an alias to a member.
     *
     * @param alias - alias to lookup
     * @return TokenMember
     */
    resolveAlias(alias: Alias): Promise<?TokenMember> {
        return Util.callAsync(this.resolveAlias, async () => {
            const res = await this._unauthenticatedClient.resolveAlias(alias);
            return res.data.member;
        });
    }

    /**
     * Creates a Token member with an alias.
     *
     * @param alias - the member's alias
     * @param CryptoEngine - engine to use for key creation and storage
     * @param Member - Member class for creation
     * @param memberType - type of member to create. "PERSONAL" if undefined
     * @param tokenRequestId - (optional) token request ID if the member is being claimed
     * @return Promise of created Member
     */
    createMemberCore(
        alias: ?Alias,
        CryptoEngine: Class<KeyStoreCryptoEngine>,
        Member: Class<Member>,
        memberType?: string,
        tokenRequestId?: string
    ): Promise<Object> {
        return Util.callAsync(this.createMemberCore, async () => {
            const response = await this._unauthenticatedClient.createMemberId(
                memberType,
                tokenRequestId
            );
            const engine = new CryptoEngine(response.data.memberId);
            const pk1 = await engine.generateKey('PRIVILEGED');
            const pk2 = await engine.generateKey('STANDARD');
            const pk3 = await engine.generateKey('LOW');
            await this._unauthenticatedClient.approveFirstKeys(
                response.data.memberId,
                [pk1, pk2, pk3],
                engine);
            const member = new Member({
                memberId: response.data.memberId,
                cryptoEngine: engine,
                ...this.options,
            });
            alias && await member.addAlias(alias);
            return member;
        });
    }

    /**
     * Returns 'logged-in' member that uses keys already in the CryptoEngine.
     * If memberId is not provided, the last member to 'log in' will be used.
     *
     * @param CryptoEngine - engine to use for key creation and storage
     * @param Member - Member class for creation
     * @param memberId - optional ID of the member we want to log in
     * @return instantiated member
     */
    getMemberCore(
        CryptoEngine: Class<KeyStoreCryptoEngine>,
        Member: Class<Member>,
        memberId: string
    ): Object {
        return Util.callSync(this.getMemberCore, () => {
            if (!memberId && typeof CryptoEngine.getActiveMemberId === 'function') {
                memberId = CryptoEngine.getActiveMemberId();
            }
            const engine = new CryptoEngine(memberId);
            return new Member({
                memberId,
                cryptoEngine: engine,
                ...this.options,
            });
        });
    }

    /**
     * Gets a list of countries with Token-enabled banks.
     *
     * @param options - optional parameters for getBanks
     * @return list of banks
     */
    getBanks(
        options?: {
            ids?: Array<string>,
            search?: string,
            country?: string,
            page?: number,
            perPage?: number,
            provider?: string,
            destinationCountry?: string,
        }
    ): Promise<{banks: Array<Bank>, paging: Paging}> {
        return Util.callAsync(this.getBanks, async () => {
            const res = await this._unauthenticatedClient.getBanksOrCountries(options);
            return res.data;
        });
    }

    /**
     * Gets a list of available countries for linking.
     *
     * @param options - optional parameters for getBanksCountries
     * @return list of countries with linkable banks
     */
    getCountries(
        options?: {
            ids?: Array<string>,
            search?: string,
            country?: string,
            provider?: string,
            destinationCountry?: string,
        }
    ): Promise<{countries: Array<string>}> {
        return Util.callAsync(this.getBanks, async () => {
            const res = await this._unauthenticatedClient.getBanksOrCountries(options, true);
            return res.data.countries;
        });
    }
}
