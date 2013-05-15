var TodoList = Backbone.View.extend({
	el: '#page',
	render: function() {
		this.$el.html('Conent should show here');
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