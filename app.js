import bodyParser from 'body-parser'
import express from 'express';
import db from './db/db';

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/api/v1/todos', (req, res) => {
    res.status(200).send({
        success: 'true',
        message: 'todos received succesfully',
        todos: db
    })
});

app.post('/api/v1/todos', (req, res) => {
    if(!req.body.title) {
        return res.status(400).send({
            success: 'false',
            message: 'Title is required'
        });
    } else if (!req.body.description) {
        return res.statis(400).send({
            success: 'false',
            message: 'Description is required'
        });
    }

    const todo = {
        id: db.length + 1,
        title: req.body.title,
        description: req.body.description
    }
    db.push(todo);
    return res.status(201).send({
        success: 'true',
        message: 'todo added succesfully', todo
    })
});

app.get('/api/v1/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.map((todo) => {
        if (todo.id === id) {
            return res.status(200).send({
                success: 'true',
                message: 'todo retrieved succesfully',
                todo,
            });
        }
    });

    return res.status(404).send({
        success: 'false',
        message: 'todo does not exist'
    });
});

app.delete('/api/v1/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    db.map((todo) => {
        if(todo.id === id) {
            db.splice(index, 1);
            return res.status(204).send({
                success: 'true',
                message: 'todo deleted succesfully'
            });
        }
    });
    return res.status(404).send({
        success: 'false',
        message: 'todo does not exist'
    });
});

app.put('/api/v1/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    let todoFound;
    let itemIndex;
    db.map((todo, index) => {
        if (todo.id === id) {
            todoFound = todo;
            itemIndex = index;
        }
    });

    if (!todoFound) {
        return res.status(404).send({
            succes: 'false',
            message: 'todo not found'
        });
    }
    if (!req.body.title) {
        return res.status(400).send({
            success: 'false',
            message: 'title is required'
        })
    }
    else if (!req.body.description) {
        return res.status(400).send({
            succes: 'false',
            message: 'description is required'
        })
    }

    const updatedTodo = {
        id: todoFound.id,
        title: req.body.title || todoFound.title,
        description: req.body.description || todoFound.description
    };

    db.splice(itemIndex, 1, updatedTodo);

    return res.status(200).send({
        success: 'true',
        message: 'todo updated succesfully',
        updatedTodo,
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})