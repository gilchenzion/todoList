function htmlEncode(value){
  return $('<div/>').text(value).html();
}

function htmlDecode(value){
  return $('<div/>').html(value).text();
}




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

var Router = Backbone.Router.extend({
	routes: {
		'' : 'home',
		'new': 'editToDo',
		'edit/:id': 'editToDo'
	}
});

var router = new Router();



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
	render: function(options) {
		var that = this;
		if(options.id) {
			var item = new Item({ id: options.id});
			item.fetch({
				success: function(item) {
					var template = _.template($('#edit-todo-temp').html(), {item: item});
					that.$el.html(template);
				}
			})
		} else {
			var template = _.template($('#edit-todo-temp').html(), {item : null});
			this.$el.html(template);
		}
		
	},
	events: {
		'submit .edit-todo-form': 'saveUser'
	},
	saveUser: function(ev) {
		var todoDetails = $(ev.currentTarget).serializeObject();
		var item = new Item();
		item.save(todoDetails, {
			success: function(item) {
				router.navigate('', {trigger: true});
			}
		})
		
		return false;
	}
});


var todo = new TodoList();
var editToDo = new EditToDo();

router.on('route:home', function(){
	todo.render();
});
router.on('route:editToDo', function(id) {
	editToDo.render({id : id});
})

Backbone.history.start();