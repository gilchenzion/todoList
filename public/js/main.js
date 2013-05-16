var Todos = Backbone.Collection.extend({
	url: 'http://localhost:3000/todo'
});

var TodoList = Backbone.View.extend({
	el: '#page',
	render: function() {
		var that = this;
		var doing = new Todos();
		doing.fetch({
			success: function() {
				var template = _.template($('#todos-template').html(), {doing: doing.models});
				that.$el.html(template);
			}
		});
	}
});

var Router = Backbone.Router.extend({
	routes: {
		'' : 'home'
	}
});

var router = new Router();
var todo = new TodoList();

router.on('route:home', function(){
	todo.render();
});

Backbone.history.start();