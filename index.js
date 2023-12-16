const express = require("express")
var morgan = require('morgan')
const cors = require('cors')



morgan.token('bodyReq', function (req, res) {
    return JSON.stringify(req.body)
})

let morgLog = morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.bodyReq(req, res)
    ].join(' ')
})


const app = express()
app.use(cors())
app.use(express.json());
app.use(morgLog)

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

function generateId() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1;
}

function nameDuplicated(name) {
    for (let i = 0; i < persons.length; i++) {
        const e = persons[i];
        if (e.name == name)
            return true
    }
    return false
}



app.get("/", (request, response) => {
    response.send('<a href="http://localhost:3001/api/persons">persons</a>')
})

app.get("/api/persons", (request, response) => {
    response.send(persons)
})


app.get("/api/persons/:id", (request, response) => {
    let id = request.params.id
    let person = persons.find((e) => e.id == id)
    if (person)
        response.json(person)
    else
        response.status(404).json({ error: "person not found" })
})

app.get("/info", (request, response) => {
    response.send(`<p>Phonebook has infor for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.delete("/api/persons/:id", (request, response) => {
    let id = request.params.id
    persons = persons.filter((e) => e.id != id)
    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    let id = generateId()
    let body = request.body

    if (!body) {
        return response.status(400).json({ err: 'body missing' })
    }
    if (!body.name) {
        return response.status(400).json({ err: 'name missing' })
    }
    if (!body.number) {
        return response.status(400).json({ err: 'number missing' })
    }
    if (nameDuplicated(body.name)) {
        return response.status(400).json({ err: 'name must be unique' })
    }



    let person = {
        ...request.body,
        id
    }

    persons.push(person)

    response.json(person)
})


let PORT = 3001
app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
})