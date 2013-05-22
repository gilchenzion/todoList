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

var Item = Backbone.Model.extend({
	urlRoot: 'http://localhost:3000/todo',
	idAttribute: "_id",
	defaults: {
		title: '',
		status: 'ready'
	}
});

var Todos = Backbone.Collection.extend({
	url: 'http://localhost:3000/todo',
	model: Item
});

var ItemView = Backbone.View.extend({
	tagName: 'tr',
	initialize: function() {
		_.bindAll(this, 'render', 'update', 'delete');
	},
	events: {
		"click a.remove": "delete",
		"click a.update": "update"
	},
	render: function() {
		var template = _.template($('#todos-item-template').html(), { item : this.model});
		$(this.el).append(template);
		return this;
	},
	delete: function(ev) {
		var that = this;
		this.model.destroy({
			success: function() {
				$(that.el).remove();
				console.log("YES");
			}
		});
	},
	update: function(ev) {
		console.log("update");
	}
});



var TodoList = Backbone.View.extend({
	tagName: 'tbody',
    initialize: function(){
        _.bindAll(this, "renderItem");
    },
	renderItem: function(model) {
		
		var itemView = new ItemView({model: model});

		itemView.render();
		
		$(this.el).append(itemView.el);
	},
	render: function() {
		var that = this;
		that.todos = new Todos();
		that.todos.fetch({
			success: function() {
				that.todos.each(function(model){ 
					that.renderItem(model); 
				});
			}
		});
	}
});


var EditToDo = Backbone.View.extend({
	el: '#page',
	render: function(options) {
		var that = this;
		if(options.id) {
			that.item = new Item({ id: options.id});
			that.item.fetch({
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
		'submit .edit-todo-form': 'saveUser',
		'click .delete': 'deleteUser'
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
	},
	deleteUser: function(ev) {
		this.item.destroy({
			success: function() {
				router.navigate('', {trigger: true});
			}
		});
		return false;
	}
});


var todoList = new TodoList();

var editToDo = new EditToDo();

router.on('route:home', function(){
	todoList.render();
	$("#ready").html(todoList.el);
});

router.on('route:editToDo', function(id) {
	editToDo.render({id : id});
})


Backbone.history.start();