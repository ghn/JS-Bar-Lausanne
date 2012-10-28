define([
	// Libs
	"use!backbone",
	
	// i18n
	"i18n!nls/lang",
	
	// Modules
	'modules/bar.module',
	'modules/map.module',
	"modules/distance.module",
],

function(Backbone, Dico, Bars, Map, Distance) {
	
	var Homepage = Backbone.View.extend({
	
		el : $('#app'),
		
		buttons : {
			terrasse : false,
			hh : false,
			food : false
		},
		
		map : null, 		// instance of Google map
		distance : null,	// instance of Distance
		map : null,			// instance of Map
		bars : null,		// filtered list of bars
		
		events : {
			'click .btn.terrasse'	: 'filterTerrasse',
			'click .btn.hh'			: 'filterHH',
			'click .btn.food'		: 'filterFood'
		},
	
		initialize : function() {
			this.distance = new Distance;
			this.map = new Map;
			
			this.init();
			
			// enable tooltips
			$('button[rel="tooltip"]').tooltip();
		},
		
		init : function() {
			var self = this;
			Bars.fetch({
				success : function() {
					self.render();
					self.map.get_my_position(function() {
						self.map.init_map();
						self.render_map();
					});
				}
			});
		},
		
		/**
		 *
		 */		
		filterTerrasse : function(el) {
			this.buttons.terrasse = ! this.buttons.terrasse;
			
			if (this.buttons.terrasse) {
				$(el.target).addClass('btn-info');
			} else {
				$(el.target).removeClass('btn-info');
			}
			
			this.render();
		},
		
		/**
		 *
		 */
		filterHH : function(el) {
			this.buttons.hh = ! this.buttons.hh;
			
			if (this.buttons.hh) {
				$(el.target).addClass('btn-info');
			} else {
				$(el.target).removeClass('btn-info');
			}
			
			this.render();
		},
		
		/**
		 *
		 */
		filterFood : function(el) {
			this.buttons.food = ! this.buttons.food;

			if (this.buttons.food) {
				$(el.target).addClass('btn-info');
			} else {
				$(el.target).removeClass('btn-info');
			}
			
			this.render();
		},
		
		/**
		 *
		 */
		render : function() {
			var tmp = $('#templateBar').html();
			this.bars = Bars.filterBars(this.buttons);
			
			$('#lBar').html("");
			$('#lBar').append( _.template(tmp, {'bars': this.bars}) );
			
			this.render_map();
		},
		
		/**
		 *
		 */
		render_map : function() {
			this.map.reset_marker();
			this.map.place_marker(this.bars);
		}
	});
	
	var instance = null;
	
	return {
		getInstance : function() {
			if (_.isNull(instance)) {
				instance = new Homepage;
				return instance;
			} else {
				instance.init();
				return instance;
			}
		}
	};
});