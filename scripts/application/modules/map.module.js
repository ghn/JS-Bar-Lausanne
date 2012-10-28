define([
	// Libs
	"use!backbone"
],

function(Backbone) {
	
	/** MODEL */
	var Map = Backbone.Model.extend({
		
		/**
		 *
		 */
		defaults : {
			position : null,
		},
		
		map : null,		// Google map
		markers : [],	// all markers
		
		init_map : function() {
			var pos = new google.maps.LatLng(this.get('la'), this.get('lo'));
			var mapOptions = {
				center: pos,
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
			this.map = new google.maps.Map($('.map')[0], mapOptions);
			
			var marker = new google.maps.Marker({
				position: pos,
				map: this.map,
				icon: 'assets/img/me.png',
				animation: google.maps.Animation.DROP,
			});	
		},
		
		/**
		 * Get my current location
		 * Callback on operation complete
		 */
		get_my_position : function(callback) {
			var self = this;
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					self.set({
						la : position.coords.latitude,
						lo : position.coords.longitude
					})
					callback(position, true);
				});
			} else {
				callback(null, false);
			}
		},
		
		/**
		 *	Place a marker
		 */
		place_marker : function(bars) {
			var self = this;
			
			_.each(bars, function(bar) {
				var x = bar.get('position').lo;
				var y = bar.get('position').la;
				
				if (! _.isUndefined(x) && ! _.isUndefined(y)) {
					self.markers.push( new google.maps.Marker({
						position: new google.maps.LatLng(x, y),
						map: self.map,
						icon: 'assets/img/beer.png',
						animation: google.maps.Animation.DROP,
					}));
				}
			});
		},
		
		reset_marker : function() {
			_.each(this.markers, function(marker) {
				marker.setMap(null);
			});
			this.markers = [];
		}
	});
	
	/** Return */
	return Map;
});