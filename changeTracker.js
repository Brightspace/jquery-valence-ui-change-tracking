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

		_create: function() {

			var me = this;

			var isTrackingEnabled = function() {
				return ( me.element.closest(
						'[data-track-changes="true"]'
					).length > 0 );
			};

			this.element
				.data( 'changedItems', { } )
				.on( 'vui-change', function( e, args ) {

					if ( !isTrackingEnabled() ) {
						return;
					}

					me.element.data( 'changedItems' )[args.id] = true;

					if ( !e.isChangeHighlighted ) {
						me.element.addClass( 'vui-changed' );
						e.isChangeHighlighted = true;
					}

				} ).on( 'vui-restore', function( e, args ) {

					if( !isTrackingEnabled() ) {
						return;
					}

					if( me.element.data( 'changedItems' )[args.id] !== undefined ) {
						delete me.element.data( 'changedItems' )[args.id];
					}

					if ( Object.keys( me.element.data( 'changedItems' ) ).length === 0 ) {
						me.element.removeClass( 'vui-changed' );
					} 

				} );

		},

		_destroy: function () {

			$( this.element )
				.removeClass( 'vui-changed' )
				.off( 'vui-change vui-restore' );

		},

		containsChanges: function() {
			return ( Object.keys( this.element.data( 'changedItems' ) ).length > 0 );
		},

		isHighlightingChanges: function () {
			return $( this.element ).hasClass( 'vui-changed' );
		}

	} );

	vui.addClassInitializer(
			'vui-change-tracker',
			function( node ) {
				$( node ).vui_changeTracker();
			}
		);

} )( window.vui );