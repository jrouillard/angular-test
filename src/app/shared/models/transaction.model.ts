export type Currency = 'BTC' | 'XTZ';

export interface Transaction {
    id: number;
    fromAccount: string;
    toAccount: string;
    date: Date;
    amount: number;
    currency: string;
    fee: boolean;
    metadata: {key: string, value: string}[];
}

export const FROM_ACCOUNTS = ['Primary account', 'Secondary account'];
export const TO_ACCOUNTS = ['Remote primary', 'Remote secondary'];
export const CURRENCY = ['BTC', 'XTZ'];
