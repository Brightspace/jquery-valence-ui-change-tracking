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

			var $node = $( this.element );

			var changedItems = {};

			$node.on( 'vui-change', function( e, args ) {

				changedItems[args.id] = true;

				$node.addClass( 'vui-changed' );

			} ).on( 'vui-restore', function( e, args ) {

				if ( changedItems[args.id] !== undefined ) {
					delete changedItems[args.id];
				}

				if ( Object.keys( changedItems ).length === 0 ) {
					$node.removeClass( 'vui-changed' );
				} 

			} );

		},

		_destroy: function () {

			$( this.element )
				.removeClass( 'vui-changed' )
				.off( 'vui-change vui-restore' );

		},

		hasChanged: function() {
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