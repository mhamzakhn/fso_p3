const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json());
app.use(express.static('dist'))
app.use(morgan('tiny'))

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url : status :res[content-length] - :response-time ms :body'))

let contacts = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (req, res) => {
    const num = contacts.length
    const date = new Date()

    res.send(`
        <p>Phonebook has info for ${num} people</p>
        <p>${date}</p>    
    `)
})

app.get('/api/persons', (req, res) => {
    res.json(contacts)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const contact = contacts.find(contact => contact.id === id)

    if (contact) {
        res.json(contact)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    contacts = contacts.filter(contact => contact.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({error: "name or number missing"})
    }

    const nameExists = contacts.some(contact => contact.name === body.name)
    if (nameExists) {
        return res.status(400).json({ error: "name must be unique" })
    }

    const contact = {
        id: Math.floor(Math.random() * 1000000).toString(),
        name: body.name,
        number: body.number
    }

    contacts = contacts.concat(contact)

    res.json(contact)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})