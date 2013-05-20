var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.pure().BSON;

var server = new Server('localhost', 27017, {auto_reconnect: true}, {safe: true});
db = new Db('tododb', server);

db.open(function(err, db) {
	if(!err){
		console.log("Connected to 'tododb' database");
		db.collection('todo', {strict: true}, function(err, collection) {
			if(err) {
				console.log("The 'todo' collection doesn't exist");
				populateDB();
			}
		});
	}
});

exports.findAll = function(req, res) {
	db.collection('todo', function(err, collection) {
		collection.find().toArray(function(err, items){
			res.send(items);
		});
	});
}

exports.findById = function(req, res) {
	var id = req.params.id;
	console.log('Retrieving item:' + id);
	db.collection('todo', function(err, collection) {
		collection.findOne({ '_id': new BSON.ObjectID(id)}, function(err, item) {
			res.send(item);
		});
	});
}

exports.addToDo = function(req, res) {
	var todo = req.body;
	console.log('Adding Todo: ' + JSON.stringify(todo));
	db.collection('todo', function(err,collection) {
		collection.insert(todo, {safe: true}, function(err, result) {
			if(err) {
				res.send({'error':'An error has occured'});
			} else {
				console.log('Success: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
}

exports.updateToDo = function(req, res) {
	var id = req.params.id;
	var todo = req.body;
	console.log('Updating todo: ' + id);
	console.log(JSON.stringify(todo));
	db.collection('todo', function(err, collection) {
		collection.update({'_id': new BSON.ObjectID(id)}, todo, {safe: true}, function(err, result) {
			if(err) {
				console.log('Error updating todo: ' + err);
				res.send({'error':'An error has occurred'});
			} else {
				console.log('' + result + ' document(s) updated');
                res.send(todo);
			}
		});
	});
}

exports.deleteToDo = function(req,res) {
	var id = req.params.id;
	console.log('Deleting todo: ' + id);
	db.collection('todo', function(err, collection) {
		collection.remove({'_id': new BSON.ObjectID(id)}, {safe: true}, function(err, result){
			if(err) {
				res.send({'error':'An error has occurred - ' + err});
			} else {
				console.log('' + result + ' document(s) deleted');
                res.send(req.body);
			}
		})
	})
}

var populateDB = function() {
 
    var todo = [
    {
        title: "Work work work",
        status: "ready"
    }];
 
    db.collection('todo', function(err, collection) {
        collection.insert(todo, {safe:true}, function(err, result) {
        	console.log("added");
        });
    });
 
};






