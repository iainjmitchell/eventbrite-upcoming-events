(function($, undefined){
	module("display upcoming events");

	test("Then upcoming events retrieved from eventbrite", function(){
		var getUpcomingEventsCalled = false;
		var eventbrite = {
			getUpcomingEvents : function(options){
				getUpcomingEventsCalled = true;
			}
		};

		$("#eventArea").eventbriteUpcomingEvents({ eventbrite: eventbrite })
		ok(getUpcomingEventsCalled);
	});

	test("One upcoming event found, Then new event area displayed on page", function(){
		var page = $("#eventArea");
		var eventbrite = {
			getUpcomingEvents : function(){
				var events = [{}];
				$(eventbrite).trigger("event", events);
			}
		}
		page.eventbriteUpcomingEvents({ eventbrite: eventbrite });
		equal(page.find(".event").length, 1);
	});
})(jQuery);

$.widget("ijm.eventbriteUpcomingEvents", {
		options: {
		},
		_create: function(){
			this.options.eventbrite.getUpcomingEvents();
			var eventDetails = $("<div>").addClass("event");
			eventDetails.appendTo(this.element);
		}
	});