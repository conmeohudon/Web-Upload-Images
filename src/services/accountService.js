import accountsData from '../mockData/accounts.json';

let accounts = [...accountsData.accounts];

export const accountService = {

    getAll: () => {
        return Promise.resolve(accounts);
    },

    getById: (id) => {
        const account = accounts.find(a => a.id === id);
        return Promise.resolve(account);
    },

    create: (accountData) => {
        const newAccount = {
            id: Math.max(...accounts.map(a => a.id)) + 1,
            ...accountData,
            createdAt: new Date().toISOString()
        };
        accounts.push(newAccount);
        return Promise.resolve(newAccount);
    },

    update: (id, accountData) => {
        const index = accounts.findIndex(a => a.id === id);
        if (index !== -1) {
            accounts[index] = { ...accounts[index], ...accountData };
            return Promise.resolve(accounts[index]);
        }
        return Promise.reject('Account not found');
    },

    delete: (id) => {
        accounts = accounts.filter(a => a.id !== id);
        return Promise.resolve();
    }
};
