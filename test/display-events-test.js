(function($, undefined){
	"use strict";
	module("display upcoming events");

	test("Then eventbrite created for user", function(){
		var user = "aUser@aDomain.com",
			eventbriteUser = undefined;
		var eventbriteFactorySpy = {
			create : function(options){
				eventbriteUser = options.user;
				return {getUpcomingEvents: function(){}};
			}
		};
		$("#eventArea").eventbriteUpcomingEvents({ user: user, eventbriteFactory: eventbriteFactorySpy });
		equal(eventbriteUser, user);
	});

	test("Then eventbrite created with api key", function(){
		var apiKey = "3242342423424",
			eventbriteApiKey = undefined;
		var eventbriteFactorySpy = {
			create : function(options){
				eventbriteApiKey = options.apiKey;
				return {getUpcomingEvents: function(){}};
			}
		};
		$("#eventArea").eventbriteUpcomingEvents({ apiKey: apiKey, eventbriteFactory: eventbriteFactorySpy });
		equal(eventbriteApiKey, apiKey);
	});

	test("One upcoming event found, Then new event area displayed on page", function(){
		var page = $("#eventArea");
		var fakeEventbrite = {
			getUpcomingEvents : function(){
				var eventDetails = {};
				$(fakeEventbrite).trigger("eventFound", eventDetails);
			}
		};
		var fakeEventbriteFactory = {
			create : function(){
				return fakeEventbrite;
			}
		};
		page.eventbriteUpcomingEvents({ eventbriteFactory: fakeEventbriteFactory });
		equal(page.find(".event").length, 1);
	});

	test("No upcoming events found, Then no event area displayed on page", function(){
		var page = $("#eventArea");
		var fakeEventbriteFactory = {
			create : function(){
				return {
					getUpcomingEvents : function(){
					}
				};
			}
		};
		page.eventbriteUpcomingEvents({ eventbriteFactory: fakeEventbriteFactory });
		equal(page.find(".event").length, 0);
	});

	test("Multiple events found, Then multiple event areas displayed on page", function(){
		var page = $("#eventArea");
		var fakeEventbrite = {
			getUpcomingEvents : function(){
				$(fakeEventbrite)
					.trigger("eventFound", {})
					.trigger("eventFound", {})
					.trigger("eventFound", {});
			}
		};
		var fakeEventbriteFactory = {
			create : function(){
				return fakeEventbrite;
			}
		};
		page.eventbriteUpcomingEvents({ eventbriteFactory: fakeEventbriteFactory });
		equal(page.find(".event").length, 3);
	});

	test("One upcoming event found, Then event title is displayed on page", function(){
		var page = $("#eventArea"),
			eventTitle = "an event";
		var fakeEventbrite = {
			getUpcomingEvents : function(){
				var eventDetails = { title : eventTitle};
				$(fakeEventbrite).trigger("eventFound", eventDetails);
			}
		};
		var fakeEventbriteFactory = {
			create : function(){
				return fakeEventbrite;
			}
		};
		page.eventbriteUpcomingEvents({ eventbriteFactory: fakeEventbriteFactory });
		equal(page.find(".event:first").find("span.title").text(), eventTitle);
	});
})(jQuery);

(function($, undefined){
	"use strict";
	var EventDisplay = function(context){
		function showEvent(e, eventDetails){
			var title = $("<span>").addClass("title").text(eventDetails.title);
			$("<div>").addClass("event")
				.append(title)
				.appendTo(context);
		}

		return {
			showEvent : showEvent
		};
	};

	$.widget("ijm.eventbriteUpcomingEvents", {
		options: {
		},
		_create: function(){
			var eventDisplay = new EventDisplay(this.element),
				eventbrite = this.options.eventbriteFactory.create({ 
					user : this.options.user,
					apiKey : this.options.apiKey
				});
			$(eventbrite).bind("eventFound", eventDisplay.showEvent);
			eventbrite.getUpcomingEvents();
		}
	});


})(jQuery);