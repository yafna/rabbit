'use strict';
(function(jtree, $, undefined ) {
			var stats;
			var particlesData = [], pP2, linePos, colors;
			var camera, scene, renderer;
			var positions, colors;
			var particles;
			var pointCloud;
			var particlePositions;
			var linesMesh;
			var controls;
            var mouse = new THREE.Vector2();
			var particleCount;
			var r = 800;
			var rHalf = r / 2;
			var targetList = [], raycaster ;
			var upperGap;

	jtree.init = function(container, data, vupperGap) {
	    upperGap = vupperGap;
		if(data !== undefined){
	        	raycaster  = new THREE.Raycaster();
				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
				camera.position.z = 1750;

				scene = new THREE.Scene();

            	var light = new THREE.PointLight( 0xeeeeee);
            	light.position.set( 1, 1, 1750 );
            	scene.add( light );

                particleCount = data.itemsNum;

				linePos = new Float32Array( (particleCount -1) * 6  );
				colors = new Float32Array( (particleCount -1) * 6 );

				idx = 0; idxline = 0;
                addParticle(data.root, linePos, colors, scene);

                var sgeometry = new THREE.SphereBufferGeometry( 17, 8, 8 );
                var material = new THREE.MeshLambertMaterial({color: 0xffff00});

				var geometry = new THREE.BufferGeometry();
				geometry.addAttribute( 'position', new THREE.BufferAttribute( linePos, 3 ).setDynamic( true ) );
				geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setDynamic( true ) );
				geometry.computeBoundingSphere();
				geometry.setDrawRange( 0, 0 );

				var material = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors, blending: THREE.AdditiveBlending,transparent: true});
				linesMesh = new THREE.LineSegments( geometry, material );
				scene.add( linesMesh );


				renderer = new THREE.WebGLRenderer();
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( window.innerWidth, window.innerHeight );
                renderer.sortObjects = false;
                container.appendChild(renderer.domElement);

				linesMesh.geometry.setDrawRange( 0, (particleCount -1) * 2 );
                linesMesh.geometry.attributes.position.needsUpdate = true;
                linesMesh.geometry.attributes.color.needsUpdate = true;
                linesMesh.frustumCulled = false;

               var axisHelper = new THREE.AxisHelper( 100 );
               axisHelper.position.set(-300, -300, -300);
               scene.add( axisHelper );

                controls = new THREE.OrbitControls( camera );
                controls.autoRotate = true;
                controls.addEventListener( 'change', render );
                controls.update();

                window.addEventListener('wheel', onDocumentMouseWheel, false);
                window.addEventListener('dblclick', onDocumentDBClick, false);
//                document.addEventListener( 'mousemove', onDocumentMouseMove, false);
        }
	};
//	function onDocumentMouseMove( event ) {
//				event.preventDefault();
//				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
//	raycaster.setFromCamera( mouse, camera );
//
//				var intersects = raycaster.intersectObjects( scene.children );
//
//				if ( intersects.length > 0 ) {
//          console.log("INTRRRR " + intersects.length);
//        }
//  }
 function onDocumentDBClick( event ) {
   event.preventDefault();
   mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
   mouse.y = - ( (event.clientY - upperGap )/ window.innerHeight ) * 2 + 1;
   raycaster.setFromCamera( mouse, camera );

   var intersects = raycaster.intersectObjects( targetList);
   if ( intersects.length > 0 ) {
      console.log("INTR " + intersects[0].uuid);
      console.log("INTR " + intersects[0].object.geometry.name);
    }
 }
   function onDocumentMouseWheel( event ) {
      if(event !== undefined && event.deltaY !== undefined && camera.fov !== undefined){
         camera.fov += event.deltaY * 0.01;
         camera.updateProjectionMatrix();
         requestAnimationFrame( onDocumentMouseWheel );
         controls.update();
         render();
      }
   }

    var idx, idxline ;
    function addParticle(root, linePos, colors, scene){
       var sgeometry = new THREE.SphereBufferGeometry( 10, 8, 8 );
       var material = new THREE.MeshLambertMaterial({color: 0xffff00});

       var sphere = new THREE.Mesh( sgeometry, material );
       sphere.position.x = root.x;
       sphere.position.y = root.y;
       sphere.position.z =  root.z;
       sphere.geometry.name = root.name;
       scene.add( sphere );
       targetList.push(sphere);
        var spritey = jtxt.makeTextSprite( root.shortName );
        spritey.position.set(root.x, root.y+10, root.z);                         //magical modifiers - to fix
        scene.add( spritey );

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
             addParticle(root.nodes[i],  linePos, colors, scene)
        }
    }
	jtree.animate = function() {
		requestAnimationFrame( jtree.animate );
		render();
	}

	function render() {
				renderer.render( scene, camera );
	}
	function onWindowResize() {
    				camera.aspect = window.innerWidth / window.innerHeight;
    				camera.updateProjectionMatrix();
    				renderer.setSize( window.innerWidth, window.innerHeight );
    }

}(window.jtree = window.jtree || {}, jQuery ));