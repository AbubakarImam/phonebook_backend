const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('type', (req, res) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'));


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const size = persons.length;
console.log(size);
const date = () => {
    const currentDate = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };

    return new Intl.DateTimeFormat('en-US', options).format(currentDate);
}

console.log(date());

const generatedId = () => {
    const randomId = Math.floor(Math.random() * 10000000)

    return randomId
}

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(note => note.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const duplicateName = persons.some(person => person.name === body.name)
    if (duplicateName) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generatedId()
    }

    persons = persons.concat(person)
    console.log(persons);
    res.json(person)
})

app.get('/info', (req, res) => {
    res.send(`
    <p> Phonebook has info for ${size} people </p>
    <p>${date()}</>
    `)
})

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something went wrong')
})

const PORT = 3002
app.listen(PORT)
console.log(`Server running on port ${PORT}`);