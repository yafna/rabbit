'use strict';
(function(jtree, $, undefined ) {
    var group;
			var stats;
			var particlesData = [], pP2, linePos, colors;
			var camera, scene, renderer;
			var positions, colors;
			var particles;
			var pointCloud;
			var particlePositions;
			var linesMesh;
			var controls;

			var particleCount;
			var particleCount = 5;
			var r = 800;
			var rHalf = r / 2;

	jtree.init = function(container, data) {
		if(data !== undefined){
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

                particleCount =data.itemsNum;

				linePos = new Float32Array( (particleCount -1) * 6  );
				colors = new Float32Array( (particleCount -1) * 6 );

				var pMaterial = new THREE.PointsMaterial( {
					color: 0xFFFFFF,
					size: 3,
					blending: THREE.AdditiveBlending,
					transparent: true,
					sizeAttenuation: false
				} );
				particles = new THREE.BufferGeometry();
				var pP2 = new Float32Array( particleCount * 3 );
				idx = 0; idxline = 0;
                addParticle(data.root, pP2, linePos, colors);
				particles.setDrawRange( 0, particleCount );
				particles.addAttribute( 'position', new THREE.BufferAttribute( pP2, 3 ).setDynamic( true ) );

				// create the particle system
				pointCloud = new THREE.Points( particles, pMaterial );
				group.add( pointCloud );

				var geometry = new THREE.BufferGeometry();
				geometry.addAttribute( 'position', new THREE.BufferAttribute( linePos, 3 ).setDynamic( true ) );
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

				linesMesh.geometry.setDrawRange( 0, (particleCount -1) * 2 );
                linesMesh.geometry.attributes.position.needsUpdate = true;
                linesMesh.geometry.attributes.color.needsUpdate = true;
                linesMesh.frustumCulled = false;


          var spritey = jtxt.makeTextSprite( " Hello, ",
		{ fontsize: 24, borderColor: {r:255, g:0, b:0, a:1.0}, backgroundColor: {r:255, g:100, b:100, a:0.8} } );
	 spritey.position.set(-85,105,55);
	 scene.add( spritey );
	var spritey = jtxt.makeTextSprite( " World! ",
		{ fontsize: 32, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
	spritey.position.set(55,105,55);
	scene.add( spritey );


                pointCloud.geometry.attributes.position.needsUpdate = true;
                requestAnimationFrame( jtree.init );
                jtree.render();

                controls = new THREE.OrbitControls( camera );
                controls.autoRotate = true;
                controls.addEventListener( 'change', jtree.render );
                controls.update();

                window.addEventListener('wheel', onDocumentMouseWheel, false);
        }
	};

   function onDocumentMouseWheel( event ) {
      if(event !== undefined && event.deltaY !== undefined && camera.fov !== undefined){
         camera.fov += event.deltaY * 0.01;
         camera.updateProjectionMatrix();
         requestAnimationFrame( onDocumentMouseWheel );
         controls.update();
         jtree.render();
      }
   }

    var idx, idxline ;
    function addParticle(root, pP2, linePos, colors){
        var connections = [];
        pP2[ idx * 3     ] = root.x;
        pP2[ idx * 3 + 1 ] = root.y;
        pP2[ idx * 3 + 2 ] = root.z;
        idx++;

        for(var i =0; i < root.nodes.length; i++){
             linePos[ idxline * 3     ] = root.x;
             linePos[ idxline * 3 + 1 ] = root.y;
             linePos[ idxline * 3 + 2 ] = root.z;
             colors[ idxline * 3     ] = 88;
             colors[ idxline * 3 + 1 ] = 20;
             colors[ idxline * 3 + 2 ] = 120;
             idxline++;
             linePos[ idxline * 3     ] = root.nodes[i].x;
             linePos[ idxline * 3 + 1 ] = root.nodes[i].y;
             linePos[ idxline * 3 + 2 ] = root.nodes[i].z;
             colors[ idxline * 3     ] = 88;
             colors[ idxline * 3 + 1 ] = 20;
             colors[ idxline * 3 + 2 ] = 120;
             idxline++;
             addParticle(root.nodes[i], pP2, linePos, colors)
        }
    }

	jtree.render = function() {
				renderer.render( scene, camera );
	};

	function onWindowResize() {
    				camera.aspect = window.innerWidth / window.innerHeight;
    				camera.updateProjectionMatrix();
    				renderer.setSize( window.innerWidth, window.innerHeight );
    }

}(window.jtree = window.jtree || {}, jQuery ));