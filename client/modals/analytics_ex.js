//import { Chart } from 'chart_chart';
var templateName = 'modal_analytics_ex';

Template[templateName].onRendered(function analyticsExOnCreated() {
	 drawChart();
});

function drawChart(){
	var socialMedia_choices = distinct(Results, 'provider');
	var result_data = [];

	$.each(socialMedia_choices, function(index, choice) {
		var likes = 0;
		var comments = 0;
		var shares = 0;

		Results.find({provider: choice}).map(function(doc) {
			likes += doc.activity_likes;
		});

		Results.find({provider: choice}).map(function(doc) {
			comments += doc.activity_comments;
		});

		Results.find({provider: choice}).map(function(doc) {
			shares += doc.activity_shares;
		});

		result_data.push([likes, comments, shares]);
	})

console.log(result_data)

	var data = {
		labels : socialMedia_choices,
		datasets : [
			{
				fillColor : dynamicColors(),
				strokeColor : dynamicColors(),
				pointColor : dynamicColors(),
				pointStrokeColor : "#fff",
				data : [result_data[0][0], result_data[1][0], result_data[2][0], result_data[3][0]]
			},
			{
				fillColor : dynamicColors(),
				strokeColor : dynamicColors(),
				pointColor : dynamicColors(),
				pointStrokeColor : "#fff",
				data : [result_data[0][1], result_data[1][1], result_data[2][1], result_data[3][1]]
			},
			{
				fillColor : dynamicColors(),
				strokeColor : dynamicColors(),
				pointColor : dynamicColors(),
				pointStrokeColor : "#fff",
				data : [result_data[0][2], result_data[1][2], result_data[2][2], result_data[3][2]]
			},
		]
	}

	//Get context with jQuery - using jQuery's .get() method.
	var ctx = $("#myChart").get(0).getContext("2d");
	//This will get the first returned node in the jQuery collection.
	var myNewChart = new Chart(ctx);

	new Chart(ctx).Bar(data);
}

//get distinct result
function distinct(collection, field) {
  return _.uniq(collection.find({}, {
    sort: {[field]: 1}, fields: {[field]: 1}
  }).map(x => x[field]), true);
}

var dynamicColors = function() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
}