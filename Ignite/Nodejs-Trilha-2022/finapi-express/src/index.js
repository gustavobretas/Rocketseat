const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

customers = [];

function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers;

    const customer = customers.find((customer) => customer.cpf === cpf);

    if (!customer) {
        return response.status(400).json({ error: "Customer not found!" });
    }

    request.customer = customer;

    return next();
}

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if (operation.type === "credit") {
            return acc + operation.amount;
        } else {
            return acc - operation.amount;
        }
    }, 0);

    return balance;
}

app.post('/account', (request, response) => {
    const { cpf, name } = request.body;

    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);

    if (customerAlreadyExists) {
        return response.status(400).json({ error: "Customer already exists!" });
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });
    
    return response.status(201).send({ message: "Account created!" });
});

app.use(verifyIfExistsAccountCPF);

app.put('/account', (request, response) => {
    const { name } = request.body;

    const { customer } = request;

    customer.name = name;
    
    return response.status(201).send({ message: "Account Updated!" });
});

app.get('/statement', (request, response) => {
    const { customer } = request;

    return response.json(customer.statement);
});

app.get('/statement/date', (request, response) => {
    const { customer } = request;

    const { date } = request.query;

    if (!date) {
        return response.status(400).json({ error: "Invalid date!" });
    };

    const statement = customer.statement.filter((statement) => {
        return statement.created_at >= new Date(date + " 00:00") && statement.created_at <= new Date(date + " 23:59");
    });

    return response.json(statement);
});

app.post('/deposit', (request, response) => {
    const { description, amount } = request.body;

    const { customer } = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    };

    customer.statement.push(statementOperation);

    return response.status(201).send({ message: "Deposit created!" });
});

app.post('/withdraw', (request, response) => {
    const { amount } = request.body;

    const { customer } = request;

    const balance = getBalance(customer.statement);

    if (balance < amount) {
        return response.status(400).json({ error: "Insufficient funds!" });
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit"
    };

    customer.statement.push(statementOperation);

    return response.status(201).send({ message: "Withdraw created!" });
});

app.listen(3333);