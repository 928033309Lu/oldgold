/* eslint-disable */
let THREE=require('./three.min');

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

function LOD() {

    THREE.Object3D.call( this );

	this.type = 'LOD';

	Object.defineProperties( this, {
		levels: {
			enumerable: true,
			value: []
		}
	} );

}

LOD.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {

	constructor: LOD,

	copy: function ( source ) {

        THREE.Object3D.prototype.copy.call( this, source, false );

		var levels = source.levels;

		for ( var i = 0, l = levels.length; i < l; i ++ ) {

			var level = levels[ i ];

			this.addLevel( level.object.clone(), level.distance );

		}

		return this;

	},

	addLevel: function ( object, distance ) {

		if ( distance === undefined ) distance = 0;

		distance = Math.abs( distance );

		var levels = this.levels;

		for ( var l = 0; l < levels.length; l ++ ) {

			if ( distance < levels[ l ].distance ) {

				break;

			}

		}

		levels.splice( l, 0, { distance: distance, object: object } );

		object.visible = false;
		this.add( object );

	},

	getObjectForDistance: function ( distance ) {

		var levels = this.levels;

		for ( var i = 1, l = levels.length; i < l; i ++ ) {

			if ( distance < levels[ i ].distance ) {

				break;

			}

		}

		return levels[ i - 1 ].object;

	},

	raycast: ( function () {

		var matrixPosition = new THREE.Vector3();

		return function raycast( raycaster, intersects ) {

			matrixPosition.setFromMatrixPosition( this.matrixWorld );

			var distance = raycaster.ray.origin.distanceTo( matrixPosition );

			this.getObjectForDistance( distance ).raycast( raycaster, intersects );

		};

	}() ),

	update: function () {

		var v1 = new THREE.Vector3();
		var v2 = new THREE.Vector3();

		return function update( camera ) {

			var levels = this.levels;
			var curLevel;

			if ( levels.length === 1 ) {
				curLevel = levels[0];
			} else if ( levels.length > 1 ) {

				v1.setFromMatrixPosition( camera.matrixWorld );
				v2.setFromMatrixPosition( this.matrixWorld );

				var distance = v1.distanceTo( v2 );

				for ( var i = 0, l = levels.length; i < l; i ++ ) {

					if ( distance >= levels[ i ].distance ) {

						curLevel = levels[ i ];

					} else {

						break;

					}

				}

			}

			this.changeLevel( curLevel );

		};

	}(),

	cesiumUpdate:function () {
		return function cesiumUpdate(camera) {
            var levels = this.levels;
            var curLevel;
            if ( levels.length === 1 ) {
                curLevel = levels[0];
            } else if ( levels.length > 1 ) {
                var distance =camera.positionCartographic.height;
                for ( var i = 0, l = levels.length; i < l; i ++ ) {
                    if ( distance >= levels[ i ].distance ) {
                        curLevel = levels[ i ];
                    } else {
                    	break;
                    }
                }
            }
            this.changeLevel( curLevel );
        }
    }(),

	changeLevel (newLevel) {
		if (newLevel && newLevel !== this.curLevel) {
			if (newLevel.object.loaded) {
				if (this.curLevel) {
					this.curLevel.object.visible = false;
					// if (this.curLevel.object.unload) this.curLevel.object.unload();
					if (this.holdingLevel) {
						if (this.holdingLevel != newLevel) this.holdingLevel.object.visible = false;
						this.holdingLevel = null;
					}
				}
				newLevel.object.visible = true;
			} else {
				if (this.curLevel && this.curLevel.object.loaded) {
					if (this.holdingLevel) {
						if (this.holdingLevel != this.curLevel) this.holdingLevel.object.visible = false;
						this.holdingLevel = null;
					}
					this.curLevel.object.visible = true;
					this.holdingLevel = this.curLevel;
				}/* else if (this.holdingLevel && this.curLevel.object.loaded) {
					if (this.holdingLevel != this.curLevel) this.holdingLevel.object.visible = false;
					this.holdingLevel = null;
				}*/

				if (newLevel.object.load) {
					newLevel.object.load(() => {
						// debugger;
						newLevel.object.loaded = true;
						if (newLevel == this.curLevel) {
							if (this.holdingLevel) {
								if (this.holdingLevel != this.curLevel) this.holdingLevel.object.visible = false;
								this.holdingLevel = null;
							}
							newLevel.object.visible = true;
						}
					});
				}
			}

			this.curLevel = newLevel;
		}
	},

	toJSON: function ( meta ) {

		var data = THREE.Object3D.prototype.toJSON.call( this, meta );

		data.object.levels = [];

		var levels = this.levels;

		for ( var i = 0, l = levels.length; i < l; i ++ ) {

			var level = levels[ i ];

			data.object.levels.push( {
				object: level.object.uuid,
				distance: level.distance
			} );

		}

		return data;

	}

} );


export default LOD;
