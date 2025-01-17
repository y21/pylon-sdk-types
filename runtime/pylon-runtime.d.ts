declare const global: typeof globalThis;

/*
  console logging
*/
interface Console {
  error(message?: any, ...optionalParams: any[]): void;
  log(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  debug(message?: any, ...optionalParams: any[]): void;
}

declare var console: Console;

/*
  base64 encode/decode and timers
*/
declare function atob(encodedString: string): string;
declare function btoa(rawString: string): string;

declare function setInterval(
  handler: (...args: any[]) => void,
  timeout?: number,
  ...arguments: any[]
): number;
declare function setTimeout(
  handler: (...args: any[]) => void,
  timeout?: number,
  ...arguments: any[]
): number;
declare function clearInterval(handle?: number): void;
declare function clearTimeout(handle?: number): void;
declare function sleep(timeout: number): Promise<void>;

/*
  fetch() related utilities
*/

declare class FormData {
  constructor();

  append(name: string, value: string | Blob, fileName?: string): void;
  delete(name: string): void;
  get(name: string): string | null;
  getAll(name: string): string[];
  has(name: string): boolean;
  set(name: string, value: string | Blob, fileName?: string): void;
  //forEach(callbackfn: (value: string, key: string, parent: FormData) => void, thisArg?: any): void;
}

declare class URLSearchParams {
  constructor(init?: string[][] | Record<string, string> | string | URLSearchParams);

  append(name: string, value: string): void;
  delete(name: string): void;
  get(name: string): string | null;
  getAll(name: string): string[];
  has(name: string): boolean;
  set(name: string, value: string): void;
  sort(): void;
  forEach(
    callbackfn: (value: string, key: string, parent: URLSearchParams) => void,
    thisArg?: any
  ): void;
}

declare class URL {
  constructor(url: string, base?: string | URL);
  hash: string;
  host: string;
  hostname: string;
  href: string;
  readonly origin: string;
  password: string;
  pathname: string;
  port: string;
  protocol: string;
  search: string;
  readonly searchParams: URLSearchParams;
  username: string;
  //toJSON(): string;
}

type BufferSource = ArrayBufferView | ArrayBuffer;

type BodyInit = BufferSource | Blob | FormData | URLSearchParams | string;

declare class Body {
  //readonly body: ReadableStream<Uint8Array> | null;
  //readonly bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  formData(): Promise<FormData>;
  json(): Promise<any>;
  text(): Promise<string>;
}

type HeadersInit = Headers | string[][] | Record<string, string>;

declare class Headers {
  constructor(init?: HeadersInit);

  append(name: string, value: string): void;
  delete(name: string): void;
  get(name: string): string | null;
  has(name: string): boolean;
  set(name: string, value: string): void;
  forEach(callbackfn: (value: string, key: string, parent: Headers) => void, thisArg?: any): void;
  toJSON(): { [key: string]: string[] };
}

type RequestInfo = Request | string;
type RequestRedirect = "follow" | "manaul" | "error";

interface RequestInit {
  body?: BodyInit | null;
  headers?: HeadersInit;
  method?: string;
  redirect?: RequestRedirect;
  window?: any;
}

declare class Request extends Body {
  constructor(input: RequestInfo, init?: RequestInit);

  readonly headers: Headers;
  //readonly integrity: string;
  readonly method: string;
  //readonly redirect: RequestRedirect;
  readonly referrer: string;
  readonly url: string;
  clone(): Request;
}

interface ResponseInit {
  headers?: HeadersInit;
  status?: number;
  statusText?: string;
  url?: string;
}

declare class Response extends Body {
  constructor(body?: BodyInit | null, init?: ResponseInit);

  readonly headers: Headers;
  readonly ok: boolean;
  readonly redirected: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly url: string;
  clone(): Response;
}

declare function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;

/*
  blob
*/

type BlobPart = BufferSource | Blob | string;
type EndingType = "transparent" | "native";

interface BlobPropertyBag {
  endings?: EndingType;
  type?: string;
}

declare class Blob {
  constructor(blobParts?: BlobPart[], options?: BlobPropertyBag);

  readonly size: number;
  readonly type: string;
  slice(start?: number, end?: number, contentType?: string): Blob;
}

/*
  text encoding/decoding
*/

interface TextDecodeOptions {
  stream?: boolean;
}

interface TextDecoderOptions {
  fatal?: boolean;
  ignoreBOM?: boolean;
}

declare class TextDecoder {
  readonly encoding: string;
  readonly fatal: boolean;
  readonly ignoreBOM: boolean;

  constructor(label?: string, options?: TextDecoderOptions);

  decode(input?: BufferSource, options?: TextDecodeOptions): string;
}

interface TextEncoderEncodeIntoResult {
  read?: number;
  written?: number;
}

declare class TextEncoder {
  readonly encoding: string;

  constructor();

  encode(input?: string): Uint8Array;
  encodeInto(source: string, destination: Uint8Array): TextEncoderEncodeIntoResult;
}

/* Pylon-specific */

declare module pylon {
  interface JsonObject {
    [property: string]: Json;
  }

  interface JsonArray extends Array<Json> {}

  type Json = string | number | boolean | null | JsonObject | JsonArray;

  interface IKVPutOptions {
    /**
     * The duration in milliseconds until the key should expire. Mutually exclusive with `ttlEpoch`.
     */
    ttl?: number;
    /**
     * The `Date` in which the key will expire.
     */
    ttlEpoch?: Date;
    /**
     * Only put the key if it does not already exist, otherwise throw an error.
     */
    ifNotExists?: boolean;
  }

  interface IKVListOptions {
    /**
     * Returns keys after `from`. Meaning, if you had the keys `["a", "b", "c"]` in the namespace, calling `kv.list({from: "a"})` would return `["b", "c"]`.
     */
    from?: string;
    /**
     * The number of keys to return in the list call.
     *
     * Default and maximum is `1000`. Minimum is `1`.
     */
    limit?: number;
  }

  interface IKVDeleteOptions {
    /**
     * Deletes the value, but only if it equals the provided value.
     */
    prevValue?: Json | Uint8Array;
  }

  namespace KVNamespace {
    type CasDeleteIfEquals = {
      key: string;
      compare: Json | Uint8Array;
      set: undefined;
    };

    type CasSetIfNotExists = {
      key: string;
      compare: undefined;
      set: Json | Uint8Array;
      ttl?: number | Date;
    };

    type CasCompareAndSwap = {
      key: string;
      compare: Json | Uint8Array;
      set: Json | Uint8Array;
      ttl?: number | Date;
    };

    type CasOperation = CasDeleteIfEquals | CasSetIfNotExists | CasCompareAndSwap;
  }

  /**
   * Pylon provides a built in key-value store that you can use to persist data.
   *
   * Since the isolate that runs your scripts is torn down every time you publish your script, and is not
   * guaranteed to have any specific lifetime, in order to persist data, you can't use global variables, as
   * those variables may be cleared out at any given time. Instead, you can use the [[pylon.KVNamespace]] to
   * store data associated with your scripts.
   */
  class KVNamespace {
    /**
     * The namespace that this KVNamespace was constructed with.
     */
    readonly namespace: string;

    /**
     * Creates a new key value store with the given `namespace`.
     *
     * You can think of each `namespace` as an individual database that you can store data in.
     *
     * #### Example
     * Creates a key value store with the namespace name "simple". All the examples in this module assume
     * this namespace is defined earlier in the code, along with a command group named `commands`.
     * ```ts
     * const simpleKv = new pylon.KVNamespace('simple');
     * ```
     * @param namespace The name used to identify your namespace.
     */
    constructor(namespace: string);

    /**
     * Sets the value of a given key within the key-value store.
     *
     * #### Example
     *
     * Sets a key to a given value.
     * ```ts
     * commands.on('put', ctx => ({key: ctx.string(), value: ctx.text()}), async (message, {key, value}) => {
     *   await simpleKv.put(key, value);
     *   await message.reply('OK!');
     * });
     * ```
     *
     * We can also get a bit more fancy, and set a key only if it doesn't exist:
     * ```ts
     * commands.on('put.nx', ctx => ({key: ctx.string(), value: ctx.text()}), async (message, {key, value}) => {
     *   try {
     *     await simpleKv.put(key, value, { ifNotExists: true });
     *     await message.reply('key set!');
     *   } catch(_) {
     *     await message.reply('key not set - already exists!');
     *   }
     * });
     * ```
     *
     * Additionally, we can also set an expiry for a key, if we only want pylon to store it for a limited time:
     *
     * ```ts
     * commands.on('put.ttl', ctx => ({key: ctx.string(), ttl: ctx.integer(), value: ctx.text()}), async (message, {key, value}) => {
     *   try {
     *     await simpleKv.put(key, value, { ttl });
     *     await message.reply(`key set, with ${ttl} millisecond time to live`);
     *   } catch(_) {
     *     await message.reply('key not set - already exists!');
     *   }
     * });
     * ```
     *
     * @param key The key to set.
     * @param value The value to set - must be JSON serializeable.
     * @param options
     */
    put(key: string, value: Json, options?: IKVPutOptions): Promise<void>;
    putArrayBuffer(key: string, value: ArrayBuffer, options?: IKVPutOptions): Promise<void>;

    /**
     * Gets a key's value - returning the value or undefined. Type `T` can be provided, in order to cast the return type of the
     * function to a given Json type.
     *
     * #### Example
     *
     * A command that gets the value of the key as a `string` and replies with it.
     * ```
     * commands.on('get', ctx => ({key: ctx.string()}), async (message, {key}) => {
     *   const value = await simpleKv.get<string>(key);
     *   await message.reply(`${key} is ${value}`);
     * });
     * ```
     * @param key The key to get
     */
    get<T extends Json>(key: string): Promise<T | undefined>;
    get(key: string): Promise<Json | undefined>;
    getArrayBuffer(key: string): Promise<ArrayBuffer | undefined>;

    /**
     * Lists the keys that are set within the namespace.
     *
     * Note that the each call to [[pylon.KVNamespace.list list]] will return at most 1,000 keys. In order to
     * paginate, simply call `list` again, with the last item in the array set to the `from` option. Keys are
     * returned in their lexicographical sort order.
     *
     * #### Example
     *
     * A command to list the first 1,000 keys:
     *
     * ```ts
     * commands.raw('list', async (message) => {
     *  const keys = await simpleKv.list();
     *  await message.reply(`The ${keys.length} keys in the simpleKV are:\n${keys.join('\n')}`);
     * });
     * ```
     *
     * How to paginate through all keys:
     *
     * ```ts
     * async function getAllKeys(kv: pylon.KVNamespace): Promise<string[]> {
     *   const keys: string[] = [];
     *   let from = "";
     *   while (true) {
     *     const page = await kv.list({from, limit: 1000});
     *     keys.push(...page);
     *     if (page.length < 1000) break;
     *     from = page[page.length - 1];
     *   }
     *   return keys;
     * }
     * ```
     */
    list(options?: IKVListOptions): Promise<string[]>;

    /**
     * Deletes a given key from the namespace. Throwing if the key does not exist, or if `options.prevValue` is set, the previous value is not equal to the
     * value provided.
     *
     * #### Example
     *
     * A command to delete a given key:
     *
     * ```ts
     * commands.on('delete', ctx => ({key: ctx.string()}), async (message, {key}) => {
     *   await simpleKv.delete(key);
     *   await message.reply('deleted');
     * });
     * ```
     *
     * Deletes a given key, if its value matches `prevValue`.
     *
     * ```ts
     * commands.on('delete.ifEquals', ctx => ({key: ctx.string(), prevValue: ctx.text()}), async (message, {key, prevValue}) => {
     *   await simpleKv.delete(key, { prevValue });
     *   await message.reply('deleted');
     * });
     * ```
     *
     * @param key The key to delete
     * @param options Options, which can provide a delete if equals.
     */
    delete(key: string, options?: IKVDeleteOptions): Promise<void>;

    /**
     * Compare and set a key's value atomically.
     *
     * NOTE: This function is a lower-level building block for safer data mutation. You almost always want to use the higher level
     * [[pylon.KVNamespace.transact transact]] or [[pylon.KVNamespace.transactWithResult transactWithResult]] functions.
     *
     * If you are reading a value, modifying that value, and then writing a new value, for example, if you are writing a currency or economy
     * system and are looking to ensure that the user's balance is atomically updated.
     *
     * Compare and set is fundamental to ensure that read after write and races do not occur. For example, if a player was to spend their
     * currency twice concurrently (because let's say they execute the command quickly...). There is a chance that both reads will occur with their
     * original balance, thus causing the deduction in funds to only happen once, essentially letting them cheat the system. Compare and set will ensure
     * that if the key was updated since you've read it, that the operation fails.
     *
     * #### Example:
     *
     * Update a player's balance, giving them 100 "credits". This is not safe, as two `kv.get()`s can happen concurrently, thus causing
     * the player's balance to only get incremented by 100, instead of 200 if this code was run twice concurrently.
     *
     * ```ts
     * const prevBalance = await simpleKv.get<number>('balance');
     * await simpleKv.put('balance', (prevBalance ?? 0) + 100);
     * ```
     *
     * Updates a player's balance atomically. Failing if the balance was updated since it was read.
     *
     * ```ts
     * const prevBalance = await simpleKv.get<number>('balance');
     * await simpleKv.cas('balance', prevBalance, (prevBalance ?? 0) + 100);
     * ```
     *
     * @param key The key to compare and set
     * @param compare The value the key must equal in order for the key to be `set`.
     * @param set The value the key will be set to if the current value equals `compare`.
     * @param ttl: Optional ttl, either a number, which is the ttl in milliseconds, or a `Date` when the key should expire.
     */
    cas(key: string, compare: Json, set: Json, ttl?: Date | number): Promise<void>;
    /**
     * Compare and set a key's value atomically, setting the value only if the key does not already exist.
     *
     * The following are equivalent: `simpleKv.put('foo', 'bar', { ifNotExists: true })` and `simpleKv.cas('foo', undefined, 'bar')`
     *
     * @param key The key to compare and set
     * @param compare When set to `undefined`, the key will only be `set` if it does not exist.
     * @param set The value the key will be set to if the key does not exist.
     * @param ttl: Optional ttl, either a number, which is the ttl in milliseconds, or a `Date` when the key should expire.
     */
    cas(key: string, compare: undefined, set: Json, ttl?: Date | number): Promise<void>;
    /**
     * Compare and delete a key's value atomically. This is functionally equivalent to [[pylon.KVNamespace.delete delete]], if the `prevValue` option is
     * provided.
     *
     * The following are equivalent: `simpleKv.delete('foo', {prevValue: 'bar'})` and `simpleKv.cas('foo', 'bar', undefined)`.
     *
     * @param key The key to compare and set.
     * @param compare The value to `compare` the key to.
     * @param set When set to `undefined`, causes the key to be deleted if it is equal to `compare`
     */
    cas(key: string, compare: Json, set: undefined): Promise<void>;

    /**
     * Compare and set multiple keys atomically. This is like [[pylon.KVNamespace.cas cas]], but operates across of multiple keys.
     *
     * NOTE: This function is a lower-level building block for safer data mutation. You almost always want to use the higher level
     * [[pylon.KVNamespace.transactMulti transactMulti]] or [[pylon.KVNamespace.transactMultiWithResult transactMultiWithResult]] functions.
     *
     * This is useful if you want to atomically update multiple keys at a time. The `casMulti` operation will only succeed if all of the
     * `operations` provided succeed. If any of the operations fail, no data will be mutated.
     *
     * @param operations
     */
    casMulti(operations: KVNamespace.CasOperation[]): Promise<void>;
    /**
     *
     * Deprecated `casMulti`, prefer the one that takes [[pylon.KVNamespace.CasOperation]]
     *
     * @deprecated
     */
    casMulti(operations: [string, Json, Json][]): Promise<void>;

    /**
     * A higher level alternative to [[pylon.KVNamespace.cas cas]]. Atomically updates a key, using the specified `transaction` function.
     *
     * #### Examples
     *
     * Atomically increments a key by a given value, returning the updated value.
     *
     * ```ts
     * const incr = (key: string, inc: number): Promise<number> =>
     *  simpleKv
     *   .transact<number>(key, (prev) => (prev ?? 0) + inc)
     *   .then((val) => val ?? 0);
     *  
     * commands.on('incr', ctx => ({key: ctx.string(), inc: ctx.integer()}), async (message, {key, inc}) => {
     *   const next = await incr(key, inc);
     *   await message.reply(`Incremented value to ${next}`);
     * })
     * ```
     *
     * @param key The key to transact upon.
     * @param transaction A function that mutates the value, returning the value that should be set to `key`.
     */
    transact<T extends Json>(
      key: string,
      transaction: (prev: T | undefined) => T | undefined
    ): Promise<T | undefined>;

    transactWithResult<T extends Json, R>(
      key: string,
      transaction: (prev: T | undefined) => { next: T | undefined; result: R }
    ): Promise<{ next: T | undefined; result: R }>;

    transactMulti<T1 extends Json>(
      keys: [string],
      transaction: (prev: [T1 | undefined]) => [T1 | undefined]
    ): Promise<[T1 | undefined]>;
    transactMulti<T1 extends Json, T2 extends Json>(
      keys: [string, string],
      transaction: (prev: [T1 | undefined, T2 | undefined]) => [T1 | undefined, T2 | undefined]
    ): Promise<[T1 | undefined, T2 | undefined]>;
    transactMulti<T1 extends Json, T2 extends Json, T3 extends Json>(
      keys: [string, string, string],
      transaction: (
        prev: [T1 | undefined, T2 | undefined, T3 | undefined]
      ) => [T1 | undefined, T2 | undefined, T3 | undefined]
    ): Promise<[T1 | undefined, T2 | undefined, T3 | undefined]>;
    transactMulti<T1 extends Json, T2 extends Json, T3 extends Json, T4 extends Json>(
      keys: [string, string, string],
      transaction: (
        prev: [T1 | undefined, T2 | undefined, T3 | undefined, T4 | undefined]
      ) => [T1 | undefined, T2 | undefined, T3 | undefined, T4 | undefined]
    ): Promise<[T1 | undefined, T2 | undefined, T3 | undefined, T4 | undefined]>;

    transactMultiWithResult<T1 extends Json, R>(
      keys: [string],
      transaction: (prev: [T1 | undefined]) => { next: [T1 | undefined]; result: R }
    ): Promise<{ next: [T1 | undefined]; result: R }>;
    transactMultiWithResult<T1 extends Json, T2 extends Json, R>(
      keys: [string, string],
      transaction: (
        prev: [T1 | undefined, T2 | undefined]
      ) => { next: [T1 | undefined, T2 | undefined]; result: R }
    ): Promise<{ next: [T1 | undefined, T2 | undefined]; result: R }>;
    transactMultiWithResult<T1 extends Json, T2 extends Json, T3 extends Json, R>(
      keys: [string, string, string],
      transaction: (
        prev: [T1 | undefined, T2 | undefined, T3 | undefined]
      ) => { next: [T1 | undefined, T2 | undefined, T3 | undefined]; result: R }
    ): Promise<{ next: [T1 | undefined, T2 | undefined, T3 | undefined]; result: R }>;
    transactMultiWithResult<T1 extends Json, T2 extends Json, T3 extends Json, T4 extends Json, R>(
      keys: [string, string, string, string],
      transaction: (
        prev: [T1 | undefined, T2 | undefined, T3 | undefined, T4 | undefined]
      ) => { next: [T1 | undefined, T2 | undefined, T3 | undefined, T4 | undefined]; result: R }
    ): Promise<{
      next: [T1 | undefined, T2 | undefined, T3 | undefined, T4 | undefined];
      result: R;
    }>;
  }

  const kv: KVNamespace;
}
