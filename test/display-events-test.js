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
		page.eventbriteUpcomingEvents({ eventbriteFactory: createFakeEventbriteFactory(fakeEventbrite) });
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
		page.eventbriteUpcomingEvents({ eventbriteFactory: createFakeEventbriteFactory(fakeEventbrite) });
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
		page.eventbriteUpcomingEvents({ eventbriteFactory: createFakeEventbriteFactory(fakeEventbrite) });
		equal(page.find(".event:first").find("span.title").text(), eventTitle);
	});

	test("One upcoming event found, Then event dateTime is displayed on page", function(){
		var page = $("#eventArea"),
			eventDateTime = "2012-11-27 18:30:00";
		var fakeEventbrite = {
			getUpcomingEvents : function(){
				var eventDetails = { start_date : eventDateTime};
				$(fakeEventbrite).trigger("eventFound", eventDetails);
			}
		};
		page.eventbriteUpcomingEvents({ eventbriteFactory: createFakeEventbriteFactory(fakeEventbrite) });
		equal(page.find(".event:first").find("span.dateTime").text(), "Tuesday, 27 November 2012 from 18:30");
	});

	function createFakeEventbriteFactory(eventbriteToReturn){
		return {
			create : function(){
				return eventbriteToReturn;
			}
		};
	}
})(jQuery);

(function($, undefined){
	"use strict";
	var EventDisplay = function(context, eventDateTimeFormat){
		function showEvent(e, eventDetails){			
			$("<div>").addClass("event")
				.append(buildEventSummary(eventDetails))	
				.appendTo(context);
		}

		function buildEventSummary(eventDetails){
			var title = $("<span>").addClass("title").text(eventDetails.title);
			if(eventDetails.start_date){
				var date = $("<span>").addClass("dateTime").text(eventDateTimeFormat.convert(eventDetails.start_date));
			}
			return title.after(date);
			
		}
		return {
			showEvent : showEvent
		};
	};

	var EventDateTimeFormat = function(){
		function convert(dateTime){
			var startDate = Date.parse(dateTime);
			return startDate.toString("dddd, d MMMM yyyy") + " from " + startDate.toString("HH:mm");
		}
		return {
			convert : convert
		}
	}

	$.widget("ijm.eventbriteUpcomingEvents", {
		options: {
		},
		_create: function(){
			var eventDateTimeFormat = new EventDateTimeFormat(),
				eventDisplay = new EventDisplay(this.element, eventDateTimeFormat),
				eventbrite = this.options.eventbriteFactory.create({ 
					user : this.options.user,
					apiKey : this.options.apiKey
				});
			$(eventbrite).bind("eventFound", eventDisplay.showEvent);
			eventbrite.getUpcomingEvents();
		}
	});
})(jQuery);