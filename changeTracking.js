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

			var $node = $( this.element ).uniqueId();
			var nodeName = $node.prop( 'nodeName' );
			var me = this;

			if ( nodeName === 'INPUT' && $node.attr( 'type' ) === 'radio' ) {
				var groupName = $node.prop( 'name' );
				if ( groupName ) {
					var selectedValue = $( 'input[name="' + groupName + '"]:checked' ).val();
					$node.data( 'selectedValue', selectedValue );
				}
			}

			$node
				.closest( '[data-track-changes="true"]' )
				.on( 'vui-reset', function() {
					$node
						.data( 'originalValue', me._getValue( $node ) )
						.data( 'hasChanged', false )
						.trigger( 'vui-restore', { 'id': $node.attr( 'id' ) } );
				});

			$node
				.data( 'originalValue', me._getValue( $node ) )
				.data( 'hasChanged', false )
				.on( 'change.vui', { me: me }, this._handleChange );

		},

		_destroy: function () {

			var $node = $( this.element );
			var args = { 'id': $node.attr( 'id' ) };

			$node
				.trigger( 'vui-restore', args )
				.off( 'change.vui' )
				.removeUniqueId();

		},

		_getValue: function( $node ) {

			var node = $node.get(0);
			var nodeName = $node.prop( 'nodeName' );

			if( nodeName === 'SELECT' ) {
				return $node.val();
			}

			if( nodeName === 'INPUT' ) {

				var inputType = $node.attr( 'type' );

				if( inputType === 'checkbox' || inputType === 'radio' ) {
					return node.checked;
				}

			}

			return node.value;

		},

		_handleChange: function( evt ) {

			var me = evt.data.me;

			var $node = me.element;
			var node = $node.get(0);
			var nodeName = $node.prop( 'nodeName' );

			if( nodeName === 'INPUT' && $node.attr( 'type' ) === 'radio' && $node.prop( 'name' ) ) {

				var groupName = $node.prop( 'name' );
				$( 'input[name="' + groupName + '"]' ).each( function( i ) {

					if( this !== node ) {

						var $this = $( this );

						if ( $this.val() === $node.data( 'selectedValue' ) ) {
							me._triggerEvent( $this );
						}

						$this.data( 'selectedValue', $node.val() );
					}

				} );

				$node.data( 'selectedValue', $node.val() );

			}

			me._triggerEvent( $node );

		},

		_triggerEvent: function( $target ) {

			var args = { 'id': $target.attr( 'id' ) };

			var hasChanged = this._getValue( $target ) !==
				$target.data( 'originalValue' );

			$target
				.data( 'hasChanged', hasChanged )
				.trigger( hasChanged ? 'vui-change' : 'vui-restore', args );

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