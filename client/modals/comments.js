var templateName = 'modal_comments';

Template[templateName].events({
	'submit form': function(event, template){
		event.preventDefault();
		
		// update comment counter 
		Results.update(Session.get("comments_edit_id"), {
			$set: {activity_comments: Session.get("comments_edit_counter") + 1}
		});

		//close modal
		Modal.hide();
	}
})