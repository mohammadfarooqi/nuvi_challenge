import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Results = new Meteor.Collection(null);

//oncreate for data template
Template.data.onCreated(function dataOnCreated() {
	this.filter_choice = new ReactiveVar("none");
	this.sort_by_choice = new ReactiveVar("none");

	//ajax get request - get data
	HTTP.call("GET", "https://nuvi-challenge.herokuapp.com/activities", function (err, res) {
		$.each(res.data, function (index, obj) {
			Results.insert(obj);
		})
	});
})

//data template helper
Template.data.helpers({
	nuvi_data() {
		var fchoice = Template.instance().filter_choice.get();
		var schoice = Template.instance().sort_by_choice.get();

		if (fchoice != "none" && schoice == "none")
			return Results.find({provider: fchoice}).fetch();
		else if (fchoice != "none" && schoice != "none") {
			if (schoice == "likes")
				return Results.find({provider: fchoice}, {sort: {activity_likes: -1}}).fetch();
			else if (schoice == "comments")
				return Results.find({provider: fchoice}, {sort: {activity_comments: -1}}).fetch();
			else if (schoice == "shares")
				return Results.find({provider: fchoice}, {sort: {activity_shares: -1}}).fetch();
			else if (schoice == "date")
				return Results.find({provider: fchoice}, {sort: {activity_date: -1}}).fetch();
		}
		else if (fchoice == "none" && schoice != "none") {
			if (schoice == "likes")
				return Results.find({}, {sort: {activity_likes: -1}}).fetch();
			else if (schoice == "comments")
				return Results.find({}, {sort: {activity_comments: -1}}).fetch();
			else if (schoice == "shares")
				return Results.find({}, {sort: {activity_shares: -1}}).fetch();
			else if (schoice == "date")
				return Results.find({}, {sort: {activity_date: -1}}).fetch();
		}
		else
			return Results.find().fetch();
	},
	nivi_data_get_filters() {
		return distinct(Results, 'provider');
	}
});

//data template event handler
Template.data.events({
	'click .filter_choice'(event, instance) {
		event.preventDefault();
		instance.filter_choice.set(event.currentTarget.innerText);
	},
	'click .sort_by_choice'(event, instance) {
		event.preventDefault();
		instance.sort_by_choice.set(event.currentTarget.innerText);
	},
	'click .like_button'(event, instance) {
		event.preventDefault();

		Results.update(this._id, {
			$set: {activity_likes: this.activity_likes + 1}
		});
	},
	'click .comment_button'(event, instance) {
		event.preventDefault();

		var link = event.currentTarget;
		var modalName = 'modal_' + link.getAttribute('data-modal');
		
		Session.set("comments_edit_id", this._id);
		Session.set("comments_edit_counter", this.activity_comments);

		Modal.show(modalName);
	},
	'click .share_button'(event, instance) {
		event.preventDefault();

		Results.update(this._id, {
			$set: {activity_shares: this.activity_shares + 1}
		});
	},
	'click #analytics_button'(event, instance) {
		event.preventDefault();

		var link = event.currentTarget;
		var modalName = 'modal_' + link.getAttribute('data-modal');

		Modal.show(modalName);
	},
});

//function to get distinct query result
function distinct(collection, field) {
  return _.uniq(collection.find({}, {
    sort: {[field]: 1}, fields: {[field]: 1}
  }).map(x => x[field]), true);
}
