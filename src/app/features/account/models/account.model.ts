export interface Account {
    id: string;
    name: string;
    balance: number;
    isPrimary: boolean;
    type: AccountType;
    userId: string;
}

export interface CreateAccountDto {
    Name: string;
    Balance : number;
    Type: AccountType;
    IsPrimary: boolean; 
}

export enum AccountType {
    wallet = 0,
    cash = 1,
    creditCard = 2,
    bankAccount = 3,
    cryptoCurrency = 4,
    debitCard = 5,
    other = 6
}