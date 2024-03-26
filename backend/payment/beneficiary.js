const Flutterwave = require('flutterwave-node-v3');

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

const createBeneficiary = async () => {

    try {
        const payload = {
            "account_number": "0690000034",
            "account_bank": "044", // This is the beneficiary’s bank code, you can use the List of Banks to retrieve a bank code.
            "beneficiary_name": 'Ade Bond'
        }
        const response = await flw.Beneficiary.create(payload)
        console.log(response);
    } catch (error) {
        console.log(error)
    }

}


createBeneficiary();

const fetchAllBeneficiary = async () => {

    try {

        const response = await flw.Beneficiary.fetch_all()
        console.log(response);
    } catch (error) {
        console.log(error)
    }

}


fetchAllBeneficiary();

const fetchBeneficiary = async () => {

    try {
        const payload = {

            "id": "2923" //This is the unique identifier for the beneficiary you intend to fetch. It is returned in the call to create a beneficiary as data.id

        }
        const response = await flw.Beneficiary.fetch(payload)
        console.log(response);
    } catch (error) {
        console.log(error)
    }

}


fetchBeneficiary();

const delBeneficiary = async () => {

    try {
        const payload = {

            "id": "4150" //This is the unique identifier for the beneficiary you intend to fetch. It is returned in the call to create a beneficiary as data.id

        }
        const response = await flw.Beneficiary.delete(payload)
        console.log(response);
    } catch (error) {
        console.log(error)
    }

}


delBeneficiary();