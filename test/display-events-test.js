(function($, undefined){
	"use strict";
	module("display upcoming events");

	test("Then upcoming events retrieved from eventbrite", function(){
		var getUpcomingEventsCalled = false;
		var fakeEventbriteFactory = {
			create : function(){
				return {
					getUpcomingEvents : function(){
						getUpcomingEventsCalled = true;
					}
				};
			}
		};
		$("#eventArea").eventbriteUpcomingEvents({ eventbriteFactory: fakeEventbriteFactory });
		ok(getUpcomingEventsCalled);
	});

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

	test("One upcoming event found, Then new event area displayed on page", function(){
		var page = $("#eventArea");
		var fakeEventbrite = {
			getUpcomingEvents : function(){
				var events = [{}];
				$(fakeEventbrite).trigger("event", events);
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
})(jQuery);

(function($, undefined){
	"use strict";
	$.widget("ijm.eventbriteUpcomingEvents", {
		options: {
		},
		_create: function(){
			var eventbrite = this.options.eventbriteFactory.create({ user : this.options.user });
			$(eventbrite).bind("event", $.proxy(this._displayEvents, this));
			eventbrite.getUpcomingEvents();
		},
		_displayEvents: function(){
			var eventDetails = $("<div>").addClass("event");
			eventDetails.appendTo(this.element);
		}
	});
})(jQuery);