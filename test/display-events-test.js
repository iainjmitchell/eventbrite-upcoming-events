(function($, undefined){
	"use strict";
	module("eventbrite initialisation");

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

	module("Events being displayed")
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

	module("Event details displayed")
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
		equal(page.find(".event:first").find(".eventSummary span.title").text(), eventTitle);
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
		equal(page.find(".event:first").find(".eventSummary span.dateTime").text(), "Tuesday, 27 November 2012 from 18:30");
	});

	test("One upcoming event found, Then event description is displayed on page", function(){
		var page = $("#eventArea"),
			eventDescription = "a description";
		var fakeEventbrite = {
			getUpcomingEvents : function(){
				var eventDetails = { description : eventDescription};
				$(fakeEventbrite).trigger("eventFound", eventDetails);
			}
		};
		page.eventbriteUpcomingEvents({ eventbriteFactory: createFakeEventbriteFactory(fakeEventbrite) });
		equal(page.find(".event:first").find("div.description").html(), eventDescription);
	});

	test("One upcoming event found, Then event venue name/city is displayed on page", function(){
		var page = $("#eventArea"),
			eventVenueName= "a Place",
			eventCity="a city";
		var fakeEventbrite = {
			getUpcomingEvents : function(){
				var eventDetails = { venue : {
					city : eventCity,
					name : eventVenueName
				}};
				$(fakeEventbrite).trigger("eventFound", eventDetails);
			}
		};
		page.eventbriteUpcomingEvents({ eventbriteFactory: createFakeEventbriteFactory(fakeEventbrite) });
		equal(page.find(".event:first").find("div.venueDetails span.venueName").html(), eventVenueName + ", " + eventCity);
	});

	test("One upcoming event found, Then event venue address is displayed on page", function(){
		var page = $("#eventArea"),
			eventAddress= "an address";
		var fakeEventbrite = {
			getUpcomingEvents : function(){
				var eventDetails = { venue : {
					address : eventAddress
				}};
				$(fakeEventbrite).trigger("eventFound", eventDetails);
			}
		};
		page.eventbriteUpcomingEvents({ eventbriteFactory: createFakeEventbriteFactory(fakeEventbrite) });
		equal(page.find(".event:first").find("div.venueDetails span.address").text(), eventAddress);
	});

	test("One upcoming event found, Then event venue postcode is displayed on page", function(){
		var page = $("#eventArea"),
			eventPostcode= "ABC D01";
		var fakeEventbrite = {
			getUpcomingEvents : function(){
				var eventDetails = { venue : {
					post_code : eventPostcode
				}};
				$(fakeEventbrite).trigger("eventFound", eventDetails);
			}
		};
		page.eventbriteUpcomingEvents({ eventbriteFactory: createFakeEventbriteFactory(fakeEventbrite) });
		equal(page.find(".event:first").find("div.venueDetails span.postcode").text(), eventPostcode);
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
		var eventSummaryElementBuilder = new EventSummaryElementBuilder(eventDateTimeFormat),
			descriptionElementBuilder = new DescriptionElementBuilder(),
			venueDetailsBuilder = new VenueDetailsBuilder();

		function showEvent(e, eventDetails){			
			$("<div>")
				.addClass("event")
				.append(eventSummaryElementBuilder.build(eventDetails))	
				.append(descriptionElementBuilder.build(eventDetails.description))	
				.append(venueDetailsBuilder.build(eventDetails.venue))	
				.appendTo(context);
		}

		return {
			showEvent : showEvent
		};
	};

	var VenueDetailsBuilder = function(){
		function build(venue){
			if (!!venue){
				var venueName = $("<span>").addClass("venueName").text(venue.name + ", " + venue.city),
					address = $("<span>").addClass("address").text(venue.address),
					postcode = $("<span>").addClass("postcode").text(venue.post_code);
				return $("<div>")
					.addClass("venueDetails")
					.append(venueName)
					.append(address)
					.append(postcode);
			}
		}

		return {
			build : build
		};
	};

	var DescriptionElementBuilder = function(){
		function build(descriptionHtml){
			return $("<div>")
				.addClass("description")
				.html(descriptionHtml);
		}
		return {
			build : build
		};
	};

	var EventSummaryElementBuilder = function(eventDateTimeFormat){
		function build(eventDetails){
			var eventSummary = $("<div>").addClass("eventSummary");
			$("<span>")
				.addClass("title")
				.text(eventDetails.title)
				.append("<br>")
				.appendTo(eventSummary);

			if(eventDetails.start_date){
				$("<span>")
					.addClass("dateTime")
					.text(eventDateTimeFormat.convert(eventDetails.start_date))
					.append("<br>")
					.appendTo(eventSummary);
			}
			return eventSummary;
		}
		return {
			build : build
		};
	};

	var EventDateTimeFormat = function(){
		function convert(dateTime){
			var startDate = Date.parse(dateTime);
			return startDate.toString("dddd, d MMMM yyyy") + " from " + startDate.toString("HH:mm");
		}
		return {
			convert : convert
		};
	};

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