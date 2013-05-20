$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
      if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
              o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
      } else {
          o[this.name] = this.value || '';
      }
  });
  return o;
};



var Todos = Backbone.Collection.extend({
	url: 'http://localhost:3000/todo'
});

var Item = Backbone.Model.extend({
	urlRoot: 'http://localhost:3000/todo'
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

var EditToDo = Backbone.View.extend({
	el: '#page',
	render: function() {
		var template = _.template($('#edit-todo-temp').html(), {});
		this.$el.html(template);
	},
	events: {
		'submit .edit-todo-form': 'saveUser'
	},
	saveUser: function(ev) {
		var todoDetails = $(ev.currentTarget).serializeObject();
		var item = new Item();
		item.save(todoDetails, {
			success: function(item) {
				console.log(item);
			}
		})
		
		return false;
	}
});

var Router = Backbone.Router.extend({
	routes: {
		'' : 'home',
		'new': 'editToDo'
	}
});

var router = new Router();
var todo = new TodoList();
var editToDo = new EditToDo();

router.on('route:home', function(){
	todo.render();
});
router.on('route:editToDo', function() {
	editToDo.render();
})

Backbone.history.start();