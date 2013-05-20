var express = require('express'),
	todo = require('./routes/todo');

var app = express();

app.configure(function() {
	app.use(express.bodyParser());
});

app.get('/todo', todo.findAll);
app.get('/todo/:id', todo.findById);
app.post('/todo', todo.addToDo);
app.put('/todo/:id', todo.updateToDo);
app.delete('/todo/:id', todo.deleteToDo);

app.listen(3000);
console.log('Listening on port 3000...');