import { usePolywrapClient, usePolywrapInvoke } from "@polywrap/react";
import { UsePolywrapInvoke } from "@polywrap/react/build/invoke";
import { InvokeResult } from "@polywrap/core-js";

const ipfsUri = "wrap://ipfs/QmW6rsaFCx9mNDdqzKfGjmKv5bqtUknrd9a8RGiKisk5Xh";

export const apiUri = ipfsUri;

export const useQuery = <TData = Record<string, unknown>>(
  method: string
): [
  (args?: Record<string, unknown> | Uint8Array) => Promise<InvokeResult<TData>>,
  Partial<UsePolywrapInvoke<TData>>
] => {
  const { execute, loading, data, error } = usePolywrapInvoke<TData>({
    uri: ipfsUri,
    method: method,
  });
  return [execute, { data, loading, error }];
};

export const useInvoke = <TData = Record<string, unknown>>() => {
  const client = usePolywrapClient();
  const invoke = async ({
    method,
    args,
  }: {
    method: string;
    args: Record<string, unknown>;
  }) => client.invoke<TData>({ uri: ipfsUri, method, args });
  return invoke;
};
