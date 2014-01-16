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

	$.widget( 'vui.vui_changeTracking', {

		_create: function() {

			var $node = $( this.element );
			var nodeName = $node.prop( 'nodeName' );

			$node.uniqueId();

			var getValue = function( $tempNode ) {

				var node = $tempNode.get(0);

				if ( nodeName === 'SELECT' ) {
					return $tempNode.val();
				}

				if ( nodeName === 'INPUT' ) {

					var inputType = $tempNode.attr( 'type' );

					if ( inputType === 'checkbox' || inputType === 'radio' ) {
						return node.checked;
					}

				}

				return node.value;

			};

			var triggerEvent = function( $target ) {

				var args = { 'id': $target.attr( 'id' ) };

				if ( getValue( $target ) === $target.data( 'originalValue' ) ) {

					$target
						.data( 'hasChanged', false )
						.trigger( 'vui-restore', args );

				} else {

					$target
						.data( 'hasChanged', true )
						.trigger( 'vui-change', args );

				}

			};

			if ( nodeName === 'INPUT' && $node.attr( 'type' ) === 'radio' ) {
				var groupName = $node.prop( 'name' );
				if ( groupName ) {
					var selectedValue = $( 'input[name="' + groupName + '"]:checked' ).val();
					$node.data( 'selectedValue', selectedValue );
				}
			}

			$node
				.data( 'originalValue', getValue( $node ) )
				.data( 'hasChanged', false );

			$node.on( 'change.vui', function( e ) {

				var $target = $( e.target );

				if ( nodeName === 'INPUT' && $node.attr( 'type' ) === 'radio' && $node.prop( 'name' ) ) {

					$( 'input[name="' + groupName + '"]' ).each( function( i ) {

						if ( this !== e.target ) {

							var $this = $( this );

							if ( $this.val() === $target.data( 'selectedValue' ) ) {
								triggerEvent( $this );
							}

							$this.data( 'selectedValue', $target.val() );
						}

					} );

					$target.data( 'selectedValue', $target.val() );

				}

				triggerEvent( $target );

			} );

		},

		_destroy: function () {

			var $node = $( this.element );

			$node
				.trigger( 'vui-restore', $node.attr( 'id' ) )
				.off( 'change.vui' )
				.removeUniqueId();

		},

		hasChanged: function() {
			return $( this.element ).data( 'hasChanged' );
		}

	} );

	vui.addClassInitializer(
			'vui-input',
			function( node ) {
				$( node ).vui_changeTracking();
			}
		);

} )( window.vui );