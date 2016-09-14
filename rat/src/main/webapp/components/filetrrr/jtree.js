'use strict';
(function(jtree, $, undefined ) {
    var group;
			var stats;
			var particlesData = [];
			var camera, scene, renderer;
			var positions, colors;
			var particles;
			var pointCloud;
			var particlePositions;
			var linesMesh;

			var maxParticleCount = 1000;
			var particleCount = 5;
			var r = 800;
			var rHalf = r / 2;

			var effectController = {
				showDots: true,
				showLines: true,
				minDistance: 150,
				limitConnections: false,
				maxConnections: 20,
				particleCount: 500
			};

	jtree.init = function(container) {
				//
				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
				camera.position.z = 1750;

				scene = new THREE.Scene();
				group = new THREE.Group();
				scene.add( group );

				var helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxGeometry( r, r, r ) ) );
				helper.material.color.setHex( 0x080808 );
				helper.material.blending = THREE.AdditiveBlending;
				helper.material.transparent = true;
				group.add( helper );

				var segments = maxParticleCount * maxParticleCount;

				positions = new Float32Array( segments * 3 );
				colors = new Float32Array( segments * 3 );

				var pMaterial = new THREE.PointsMaterial( {
					color: 0xFFFFFF,
					size: 3,
					blending: THREE.AdditiveBlending,
					transparent: true,
					sizeAttenuation: false
				} );

				particles = new THREE.BufferGeometry();
				particlePositions = new Float32Array( maxParticleCount * 3 );

				for ( var i = 0; i < maxParticleCount; i++ ) {

					var x = Math.random() * r - r / 2;
					var y = Math.random() * r - r / 2;
					var z = Math.random() * r - r / 2;

					particlePositions[ i * 3     ] = x;
					particlePositions[ i * 3 + 1 ] = y;
					particlePositions[ i * 3 + 2 ] = z;

					// add it to the geometry
					particlesData.push( {
						velocity: new THREE.Vector3( -1 + Math.random() * 2, -1 + Math.random() * 2,  -1 + Math.random() * 2 ),
						numConnections: 0
					} );

				}

				particles.setDrawRange( 0, particleCount );
				particles.addAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setDynamic( true ) );

				// create the particle system
				pointCloud = new THREE.Points( particles, pMaterial );
				group.add( pointCloud );

				var geometry = new THREE.BufferGeometry();

				geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setDynamic( true ) );
				geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setDynamic( true ) );

				geometry.computeBoundingSphere();

				geometry.setDrawRange( 0, 0 );

				var material = new THREE.LineBasicMaterial( {
					vertexColors: THREE.VertexColors,
					blending: THREE.AdditiveBlending,
					transparent: true
				} );

				linesMesh = new THREE.LineSegments( geometry, material );
				group.add( linesMesh );

				//
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.gammaInput = true;
				renderer.gammaOutput = true;

				container.appendChild( renderer.domElement );
	};

	jtree.animate = function() {
				var vertexpos = 0;
				var colorpos = 0;
				var numConnected = 0;


				linesMesh.geometry.setDrawRange( 0, numConnected * 2 );
				linesMesh.geometry.attributes.position.needsUpdate = true;
				linesMesh.geometry.attributes.color.needsUpdate = true;
				pointCloud.geometry.attributes.position.needsUpdate = true;

				requestAnimationFrame( jtree.animate );
				jtree.render();
	};

	jtree.render = function() {
				var time = Date.now() * 0.001;
				group.rotation.y = time * 0.05;
				renderer.render( scene, camera );
	};
}(window.jtree = window.jtree || {}, jQuery ));