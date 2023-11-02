"use strict";
/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = exports.HttpClient = exports.ContentType = void 0;
var ContentType;
(function (ContentType) {
    ContentType["Json"] = "application/json";
    ContentType["FormData"] = "multipart/form-data";
    ContentType["UrlEncoded"] = "application/x-www-form-urlencoded";
    ContentType["Text"] = "text/plain";
})(ContentType = exports.ContentType || (exports.ContentType = {}));
class HttpClient {
    constructor(apiConfig = {}) {
        this.baseUrl = "https://brapi.dev";
        this.securityData = null;
        this.abortControllers = new Map();
        this.customFetch = (...fetchParams) => fetch(...fetchParams);
        this.baseApiParams = {
            credentials: "same-origin",
            headers: {},
            redirect: "follow",
            referrerPolicy: "no-referrer",
        };
        this.setSecurityData = (data) => {
            this.securityData = data;
        };
        this.contentFormatters = {
            [ContentType.Json]: (input) => input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
            [ContentType.Text]: (input) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
            [ContentType.FormData]: (input) => Object.keys(input || {}).reduce((formData, key) => {
                const property = input[key];
                formData.append(key, property instanceof Blob
                    ? property
                    : typeof property === "object" && property !== null
                        ? JSON.stringify(property)
                        : `${property}`);
                return formData;
            }, new FormData()),
            [ContentType.UrlEncoded]: (input) => this.toQueryString(input),
        };
        this.createAbortSignal = (cancelToken) => {
            if (this.abortControllers.has(cancelToken)) {
                const abortController = this.abortControllers.get(cancelToken);
                if (abortController) {
                    return abortController.signal;
                }
                return void 0;
            }
            const abortController = new AbortController();
            this.abortControllers.set(cancelToken, abortController);
            return abortController.signal;
        };
        this.abortRequest = (cancelToken) => {
            const abortController = this.abortControllers.get(cancelToken);
            if (abortController) {
                abortController.abort();
                this.abortControllers.delete(cancelToken);
            }
        };
        this.request = (_a) => __awaiter(this, void 0, void 0, function* () {
            var { body, secure, path, type, query, format, baseUrl, cancelToken } = _a, params = __rest(_a, ["body", "secure", "path", "type", "query", "format", "baseUrl", "cancelToken"]);
            const secureParams = ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
                this.securityWorker &&
                (yield this.securityWorker(this.securityData))) ||
                {};
            const requestParams = this.mergeRequestParams(params, secureParams);
            const queryString = query && this.toQueryString(query);
            const payloadFormatter = this.contentFormatters[type || ContentType.Json];
            const responseFormat = format || requestParams.format;
            return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, Object.assign(Object.assign({}, requestParams), { headers: Object.assign(Object.assign({}, (requestParams.headers || {})), (type && type !== ContentType.FormData ? { "Content-Type": type } : {})), signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal, body: typeof body === "undefined" || body === null ? null : payloadFormatter(body) })).then((response) => __awaiter(this, void 0, void 0, function* () {
                const r = response;
                r.data = null;
                r.error = null;
                const data = !responseFormat
                    ? r
                    : yield response[responseFormat]()
                        .then((data) => {
                        if (r.ok) {
                            r.data = data;
                        }
                        else {
                            r.error = data;
                        }
                        return r;
                    })
                        .catch((e) => {
                        r.error = e;
                        return r;
                    });
                if (cancelToken) {
                    this.abortControllers.delete(cancelToken);
                }
                if (!response.ok)
                    throw data;
                return data;
            }));
        });
        Object.assign(this, apiConfig);
    }
    encodeQueryParam(key, value) {
        const encodedKey = encodeURIComponent(key);
        return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
    }
    addQueryParam(query, key) {
        return this.encodeQueryParam(key, query[key]);
    }
    addArrayQueryParam(query, key) {
        const value = query[key];
        return value.map((v) => this.encodeQueryParam(key, v)).join("&");
    }
    toQueryString(rawQuery) {
        const query = rawQuery || {};
        const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
        return keys
            .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
            .join("&");
    }
    addQueryParams(rawQuery) {
        const queryString = this.toQueryString(rawQuery);
        return queryString ? `?${queryString}` : "";
    }
    mergeRequestParams(params1, params2) {
        return Object.assign(Object.assign(Object.assign(Object.assign({}, this.baseApiParams), params1), (params2 || {})), { headers: Object.assign(Object.assign(Object.assign({}, (this.baseApiParams.headers || {})), (params1.headers || {})), ((params2 && params2.headers) || {})) });
    }
}
exports.HttpClient = HttpClient;
/**
 * @title brapi - API de finanças
 * @version 2.6.0
 * @termsOfService /terms-of-use
 * @baseUrl https://brapi.dev
 * @contact brapi <brapi@proton.me> (https://brapi.dev/)
 *
 * Tenha acesso instantâneo aos valores da cotação da bolsa de valores, dados históricos e até dados de criptomoedas em diferentes moedas
 *
 * **https://brapi.dev**
 */
class Api extends HttpClient {
    constructor() {
        super(...arguments);
        this.api = {
            /**
             * No description
             *
             * @tags ticker
             * @name QuoteDetail
             * @summary Get any tickers informarion
             * @request GET:/api/quote/{tickers}
             */
            quoteDetail: (tickers, query, params = {}) => this.request(Object.assign({ path: `/api/quote/${tickers}`, method: "GET", query: query, format: "json" }, params)),
            /**
             * No description
             *
             * @tags ticker
             * @name AvailableList
             * @summary Get all available tickers
             * @request GET:/api/available
             */
            availableList: (query, params = {}) => this.request(Object.assign({ path: `/api/available`, method: "GET", query: query, format: "json" }, params)),
            /**
             * No description
             *
             * @tags ticker
             * @name QuoteListList
             * @summary Get a summary of all tickers
             * @request GET:/api/quote/list
             */
            quoteListList: (query, params = {}) => this.request(Object.assign({ path: `/api/quote/list`, method: "GET", query: query, format: "json" }, params)),
            /**
             * No description
             *
             * @tags crypto
             * @name V2CryptoList
             * @summary Get any crypto information
             * @request GET:/api/v2/crypto
             */
            v2CryptoList: (query, params = {}) => this.request(Object.assign({ path: `/api/v2/crypto`, method: "GET", query: query, format: "json" }, params)),
            /**
             * No description
             *
             * @tags crypto
             * @name V2CryptoAvailableList
             * @summary Get all available cryptocoins
             * @request GET:/api/v2/crypto/available
             */
            v2CryptoAvailableList: (query, params = {}) => this.request(Object.assign({ path: `/api/v2/crypto/available`, method: "GET", query: query, format: "json" }, params)),
            /**
             * No description
             *
             * @tags currency
             * @name V2CurrencyList
             * @summary Get currency conversion information
             * @request GET:/api/v2/currency
             */
            v2CurrencyList: (query, params = {}) => this.request(Object.assign({ path: `/api/v2/currency`, method: "GET", query: query, format: "json" }, params)),
            /**
             * No description
             *
             * @tags inflation
             * @name V2InflationList
             * @summary Get the history of the inflation of a certain country
             * @request GET:/api/v2/inflation
             */
            v2InflationList: (query, params = {}) => this.request(Object.assign({ path: `/api/v2/inflation`, method: "GET", query: query, format: "json" }, params)),
            /**
             * No description
             *
             * @tags inflation
             * @name V2InflationAvailableList
             * @summary Get all available supported inflation countries
             * @request GET:/api/v2/inflation/available
             */
            v2InflationAvailableList: (query, params = {}) => this.request(Object.assign({ path: `/api/v2/inflation/available`, method: "GET", query: query, format: "json" }, params)),
            /**
             * No description
             *
             * @tags prime-rate (SELIC)
             * @name V2PrimeRateList
             * @summary Get the history of the prime-rate of a certain country
             * @request GET:/api/v2/prime-rate
             */
            v2PrimeRateList: (query, params = {}) => this.request(Object.assign({ path: `/api/v2/prime-rate`, method: "GET", query: query, format: "json" }, params)),
            /**
             * No description
             *
             * @tags prime-rate (SELIC)
             * @name V2PrimeRateAvailableList
             * @summary Get all available supported countries' prime-rates
             * @request GET:/api/v2/prime-rate/available
             */
            v2PrimeRateAvailableList: (query, params = {}) => this.request(Object.assign({ path: `/api/v2/prime-rate/available`, method: "GET", query: query, format: "json" }, params)),
            /**
             * No description
             *
             * @tags currency
             * @name V2CurrencyAvailableList
             * @summary Get all available currencies
             * @request GET:/api/v2/currency/available
             */
            v2CurrencyAvailableList: (query, params = {}) => this.request(Object.assign({ path: `/api/v2/currency/available`, method: "GET", query: query, format: "json" }, params)),
        };
        this.components = {
            /**
             * No description
             *
             * @name SchemasComponents
             * @request SCHEMAS:components
             */
            schemasComponents: (params = {}) => this.request(Object.assign({ path: `components`, method: "SCHEMAS" }, params)),
            /**
             * No description
             *
             * @name SecuritySchemesComponents
             * @request SECURITY SCHEMES:components
             */
            securitySchemesComponents: (params = {}) => this.request(Object.assign({ path: `components`, method: "SECURITY SCHEMES" }, params)),
        };
    }
}
exports.Api = Api;
