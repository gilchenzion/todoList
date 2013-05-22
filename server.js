var express = require('express'),
	todo = require('./routes/todo');

var app = express();

app.configure(function() {
	app.use(express.bodyParser());
});

//preventing XSS
app.all('*', function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
//on OPTIONS, handle 404 error
app.options('*',function(req,res) {
	res.send(200);
});


app.get('/todo', todo.findAll);
app.get('/todo/:id', todo.findById);
app.post('/todo', todo.addToDo);
app.put('/todo/:id', todo.updateToDo);
app.delete('/todo/:id', todo.deleteToDo);

app.listen(3000);
console.log('Listening on port 3000...');