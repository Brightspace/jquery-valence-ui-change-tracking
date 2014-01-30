/*jslint browser: true*/

( function( vui ) {

	'use strict';

	// Check if the provided vui global is defined, otherwise try to require it if
	// we're in a CommonJS environment; otherwise we'll just fail out
	if( vui === undefined ) {
		if( typeof require === 'function' ) {
			vui = require('../../core');
		} else {
			throw new Error('load vui first');
		}
	}

	// Export the vui object if we're in a CommonJS environment.
	// It will already be on the window otherwise
	if( typeof module === 'object' && typeof module.exports === 'object' ) {
		module.exports = vui;
	}

	var $ = vui.$;

	$.widget( 'vui.vui_changeTracker', {

		options: {
			showChanges: true
		},

		_create: function() {

			var me = this;

			var showChangesAttr = this.element.attr('data-show-changes');
			if( showChangesAttr === 'false' ) {
				this.options.showChanges = false;
			}

			this.element
				.data( 'changedItems', {} )
				.on( 'vui-change', function( e ) {

					var id = $( e.target ).attr('id');
					if( !id ) {
						return;
					}

					me.element.data( 'changedItems' )[id] = true;

					if( !me._isTrackingEnabled() ) {
						return;
					}

					if( me.options.showChanges && !e.isChangeShown ) {
						me.element.addClass( 'vui-changed' );
						e.isChangeShown = true;
					}

				} ).on( 'vui-restore', function( e ) {

					var id = $( e.target ).attr('id');
					if( !id ) {
						return;
					}

					var changedItems = me.element.data( 'changedItems' );
					if( changedItems[id] !== undefined ) {
						delete changedItems[id];
					}

					if( !me._isTrackingEnabled() ) {
						return;
					}

					if( me.options.showChanges &&
						Object.keys( changedItems ).length === 0 ) {
						me.element.removeClass( 'vui-changed' );
					} 

				} );

		},

		_destroy: function () {

			$( this.element )
				.removeClass( 'vui-changed' )
				.off( 'vui-change vui-restore' );

		},

		_isTrackingEnabled: function() {

			var closest = this.element.closest( '[data-track-changes]' );
			if( closest.length === 1 ) {
				return closest.attr( 'data-track-changes' ) === 'true';
			}
			
			return false;

		},

		containsChanges: function() {
			return ( Object.keys( this.element.data( 'changedItems' ) ).length > 0 );
		},

		hasElementChanged: function( elem ) {

			var id = $( elem ).attr('id');
			if( !id ) {
				return false;
			}

			var hasChanged = ( this.element.data( 'changedItems' )[id] === true );
			return hasChanged;

		},

		isChangeShown: function () {
			return this.element.hasClass( 'vui-changed' );
		}

	} );

	vui.addClassInitializer(
			'vui-change-tracker',
			function( node ) {
				$( node ).vui_changeTracker();
			}
		);

} )( window.vui );