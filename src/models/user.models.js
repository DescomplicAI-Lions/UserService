"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const users = [];
let nextId = 1;
exports.UserModel = {
    getAll: () => users,
    getById: (id) => users.find(u => u.id === id),
    getByEmail: (email) => users.find(u => u.email === email),
    create: (data) => {
        const newUser = {
            id: nextId++,
            createdAt: new Date(),
            ...data,
        };
        users.push(newUser);
        return newUser;
    },
    update: (id, data) => {
        const index = users.findIndex(u => u.id === id);
        if (index === -1)
            return undefined;
        users[index] = { ...users[index], ...data };
        return users[index];
    },
    delete: (id) => {
        const index = users.findIndex(u => u.id === id);
        if (index === -1)
            return false;
        users.splice(index, 1);
        return true;
    },
};
