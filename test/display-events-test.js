(function($, undefined){
	module("display upcoming events");

	test("when plugin is initialised, then upcoming events retrieved from eventbrite", function(){
		var getUpcomingEventsCalled = false;
		var eventbrite = {
			getUpcomingEvents : function(options){
				getUpcomingEventsCalled = true;
			}
		};

		$("#eventArea").eventbriteUpcomingEvents({ eventbrite: eventbrite })
		ok(getUpcomingEventsCalled);

	});
})(jQuery);

$.widget("ijm.eventbriteUpcomingEvents", {
		options: {
		},
		_create: function(){
			this.options.eventbrite.getUpcomingEvents();
		}
	});