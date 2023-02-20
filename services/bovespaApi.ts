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

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://brapi.dev";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
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

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
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

      if (!response.ok) throw data;
      return data;
    });
  };
}

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
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags ticker
     * @name QuoteDetail
     * @summary Get any tickers informarion
     * @request GET:/api/quote/{tickers}
     */
    quoteDetail: (
      tickers: string,
      query?: {
        /**
         * Range for historical prices
         * @example "1d"
         */
        range?: "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "2y" | "5y" | "10y" | "ytd" | "max";
        /**
         * Interval to get historial prices within the range
         * @example "1d"
         */
        interval?: "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "2y" | "5y" | "10y" | "ytd" | "max";
        /**
         * Retrieve fundamental analysis data
         * @example "true"
         */
        fundamental?: boolean;
        /**
         * Retrieve dividends data
         * @example "true"
         */
        dividends?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/quote/${tickers}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ticker
     * @name AvailableList
     * @summary Get all available tickers
     * @request GET:/api/available
     */
    availableList: (
      query?: {
        /** @example "cog" */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/available`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ticker
     * @name QuoteListList
     * @summary Get a summary of all tickers
     * @request GET:/api/quote/list
     */
    quoteListList: (
      query?: {
        /**
         * Sort the tickers by a column
         * @example "close"
         */
        sortBy?: "name" | "close" | "change" | "change_abs" | "volume" | "market_cap_basic" | "sector";
        /**
         * Sort order for sortBy
         * @example "desc"
         */
        sortOrder?: "desc" | "asc";
        /**
         * Limit the returned tickers
         * @example "10"
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/quote/list`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags crypto
     * @name V2CryptoList
     * @summary Get any crypto information
     * @request GET:/api/v2/crypto
     */
    v2CryptoList: (
      query: {
        /**
         * Add one or more cryptocoin separated by a comma. Available coins at: https://brapi.dev/api/v2/crypto/available
         * @example "BTC,ETH"
         */
        coin: string;
        /**
         * Currency value to be returned. Available currencies at: https://economia.awesomeapi.com.br/json/available/uniq
         * @example "BRL"
         */
        currency?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v2/crypto`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags crypto
     * @name V2CryptoAvailableList
     * @summary Get all available cryptocoins
     * @request GET:/api/v2/crypto/available
     */
    v2CryptoAvailableList: (
      query?: {
        /**
         * Search all cryptocoins that starts with the query, if no query is passed then all coins are returned
         * @example "BT"
         */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v2/crypto/available`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags currency
     * @name V2CurrencyList
     * @summary Get currency conversion information
     * @request GET:/api/v2/currency
     */
    v2CurrencyList: (
      query: {
        /**
         * Currency to another currency. Available currencies at: https://brapi.dev/api/v2/currency/available
         * @example "USD-BRL,EUR-USD"
         */
        currency: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v2/currency`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags inflation
     * @name V2InflationList
     * @summary Get the history of the inflation of a certain country
     * @request GET:/api/v2/inflation
     */
    v2InflationList: (
      query?: {
        /**
         * Get data for a certain country, defaults to 'brazil'
         * @example "brazil"
         */
        country?: string;
        /**
         * Get historical data for a certain country, defaults to 'false'
         * @example "false"
         */
        historical?: boolean;
        /**
         * Get historical data from a certain date, defaults to today's date (DD/MM/YYYY)
         * @example "29/10/2022"
         */
        start?: string;
        /**
         * Get historical data until a certain date, defaults to today's date (DD/MM/YYYY)
         * @example "29/10/2022"
         */
        end?: string;
        /**
         * Sort the data by a column, defaults to 'date'
         * @example "date"
         */
        sortBy?: "date" | "value";
        /**
         * Sort order for sortBy, defaults to 'desc'
         * @example "desc"
         */
        sortOrder?: "desc" | "asc";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v2/inflation`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags inflation
     * @name V2InflationAvailableList
     * @summary Get all available supported inflation countries
     * @request GET:/api/v2/inflation/available
     */
    v2InflationAvailableList: (
      query?: {
        /**
         * Find all possible supported inflation countries, if no query is passed then all supported inflation countries are returned
         * @example "br"
         */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v2/inflation/available`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags prime-rate (SELIC)
     * @name V2PrimeRateList
     * @summary Get the history of the prime-rate of a certain country
     * @request GET:/api/v2/prime-rate
     */
    v2PrimeRateList: (
      query?: {
        /**
         * Get data for a certain country, defaults to 'brazil'
         * @example "brazil"
         */
        country?: string;
        /**
         * Get historical data for a certain country, defaults to 'false'
         * @example "false"
         */
        historical?: boolean;
        /**
         * Get historical data from a certain date, defaults to today's date (DD/MM/YYYY)
         * @example "29/10/2022"
         */
        start?: string;
        /**
         * Get historical data until a certain date, defaults to today's date (DD/MM/YYYY)
         * @example "29/10/2022"
         */
        end?: string;
        /**
         * Sort the data by a column, defaults to 'date'
         * @example "date"
         */
        sortBy?: "date" | "value";
        /**
         * Sort order for sortBy, defaults to 'desc'
         * @example "desc"
         */
        sortOrder?: "desc" | "asc";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v2/prime-rate`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags prime-rate (SELIC)
     * @name V2PrimeRateAvailableList
     * @summary Get all available supported countries' prime-rates
     * @request GET:/api/v2/prime-rate/available
     */
    v2PrimeRateAvailableList: (
      query?: {
        /**
         * Find all possible supported countries' prime-rates, if no query is passed then all supported countries' prime-rates are returned
         * @example "br"
         */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v2/prime-rate/available`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags currency
     * @name V2CurrencyAvailableList
     * @summary Get all available currencies
     * @request GET:/api/v2/currency/available
     */
    v2CurrencyAvailableList: (
      query?: {
        /**
         * Find all possible currency conversions, if no query is passed then all currencies are returned
         * @example "BRL"
         */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v2/currency/available`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  components = {
    /**
     * No description
     *
     * @name SchemasComponents
     * @request SCHEMAS:components
     */
    schemasComponents: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `components`,
        method: "SCHEMAS",
        ...params,
      }),

    /**
     * No description
     *
     * @name SecuritySchemesComponents
     * @request SECURITY SCHEMES:components
     */
    securitySchemesComponents: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `components`,
        method: "SECURITY SCHEMES",
        ...params,
      }),
  };
}
