import { AlreadyStoredError, CarrierNotFoundError, ExceededStorageError } from "#error";
import { PhoneRegistryRequest } from "#protocols";
import { PhoneRepository } from "#repositories";
import { CarrierService } from "#services";

async function registerPhone({ name, description, carrier, number, cpf }: PhoneRegistryRequest) {
    if (await isAlreadyStored(number)) {
        throw new AlreadyStoredError(number);
    }

    if (await isExceedingStorage(cpf)) {
        throw new ExceededStorageError(cpf);
    }

    if (!CarrierService.isCarrier(carrier)) {
        throw new CarrierNotFoundError(carrier);
    }

    const carrier_id = (await CarrierService.readCarrier("code", carrier)).id;

    return PhoneRepository.insertPhone({
        name,
        description,
        number,
        cpf,
        carrier_id,
    });
}

async function readPhones(column: "id" | "number" | "cpf", value: number | string) {
    const res = await PhoneRepository.selectPhones(column, value);
    return res.rows;
}

async function isAlreadyStored(number: string) {
    const res = await PhoneRepository.selectPhones("number", number);
    return res.rowCount !== 0;
}

async function isExceedingStorage(cpf: string) {
    const res = await PhoneRepository.selectPhones("cpf", cpf);
    return res.rowCount === 3;
}

export const PhoneService = {
    registerPhone,
    readPhones,
    isAlreadyStored,
};
