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
		"click a.update": "update",
		"click a.previous": "back"
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
		var that = this;
		if(this.model.get('status') == "ready") {
			this.model.save({'status' : "doing"}, {
				success: function() {
					$(document).trigger('domChanged');
				}
			});
		} else {
			this.model.save({'status' : "done"}, {
				success: function() {
					$(document).trigger('domChanged');
				}
			});
		}
	},
	back: function(ev) {
		var that = this;
		if(this.model.get('status') == "doing") {
			this.model.save({'status' : "ready"}, {
				success: function() {
					$(document).trigger('domChanged');
				}
			});
		} else {
			this.model.save({'status' : "doing"}, {
				success: function() {
					$(document).trigger('domChanged');
				}
			});
		}
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
	render: function(options) {
		var that = this;
		that.todos = new Todos();
		that.todos.url += "?status=" + options.status;
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
	render: function() {
			var that = this;
			this.item = new Item();
			this.item.fetch({
				success: function(item) {
					var template = _.template($('#edit-todo-temp').html(), {});
					that.$el.html(template);
				}
			});
		
	},
	events: {
		'submit .edit-todo-form': 'saveUser'
	},
	saveUser: function(ev) {
		var todoDetails = $(ev.currentTarget).serializeObject();
		var item = new Item();
		item.save(todoDetails, {
			success: function(item) {
				$(ev.currentTarget).context[0].value = '';
				$(document).trigger('domChanged');
			}
		})
		
		return false;
	}
});





function load() {
	
	var ready = new TodoList();
	var doing = new TodoList();
	var done = new TodoList();
	ready.render({status: "ready"});
	$("#ready").html(ready.el);
	doing.render({status: "doing"});
	$("#doing").html(doing.el);
	done.render({status: "done"});
	$("#done").html(done.el);
	
}

router.on('route:home', function(){
	var editToDo = new EditToDo();
	editToDo.render();
	load();
});

$(document).bind('domChanged', function(){
	load();
});

router.on('route:editToDo', function(id) {
	editToDo.render({id : id});
});




Backbone.history.start();