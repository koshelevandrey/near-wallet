interface ConnectedAccount {
  accountId: string;
  publicKey: string;
}

export type GetConnectedAccountsResponse = Promise<ConnectedAccount[]>;
