interface PhoneBase {
    name: string;
    description: string;
    number: string;
    cpf: string;
}

export interface PhoneRegistryRequest extends PhoneBase {
    carrier: 15 | 21 | 31 | 41;
}

export interface PhoneDatabaseEntry extends PhoneBase {
    id: number;
    carrier_id: number;
}
