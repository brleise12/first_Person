import * as THREE from './pkg/three.module.js';

window.addEventListener('DOMContentLoaded', DOMContentLoaded => {

    //INIT, I know I'm supposed to have my own flair
    const render = new THREE.WebGLRenderer({canvas: document.querySelector('canvas')});
    render.setClearColor('#0ff');
    render.shadowMap.enabled = true;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x00FFFF, 0.1);
    const camera = new THREE.PerspectiveCamera(75, render.domElement.clientWidth / render.domElement.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    const resize = () => {
        camera.aspect = render.domElement.clientWidth / render.domElement.clientHeight;
        camera.updateProjectionMatrix();
        render.setSize(render.domElement.clientWidth * window.devicePixelRatio, render.domElement.clientHeight * window.devicePixelRatio, false);
    }
    resize();
    window.addEventListener('resize', resize);

    //Light, but lets be honest I would screw it up
    const direction_light = new THREE.DirectionalLight(0xFFFFFF, 0.95);
    direction_light.castShadow = true;
    direction_light.position.x = 3;
    direction_light.position.z = 4;
    direction_light.position.y = 5;
    scene.add(direction_light);

    //Ground, so I am keeping everything basically the same
    const ground_geometry = new THREE.PlaneGeometry(10000, 10000);
    const ground_material = new THREE.MeshStandardMaterial({
        color: 0x008844,
        metalness: 0,
        roughness: 1,
    });
    const ground = new THREE.Mesh(ground_geometry, ground_material);
    ground.rotation.x = -0.5 * Math.PI; 
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);

    //Cube, we can all agree its better this way
    const cube_Geometry = new THREE.BoxGeometry();
    const cube_Material = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        metalness: 0.1,
        roughness: 0.75,
    });
    const cube = new THREE.Mesh(cube_Geometry, cube_Material);
    cube.name = 'hittable';
    cube.castShadow = true;
    scene.add(cube);

    //Input, I am paying attention though
    const input = {w: false, a: false, s: false, d: false, ArrowLeft: false, ArrowRight: false, f: false};
    window.addEventListener('keydown', keydown => {
        if(input.hasOwnPropert(keydown.key)) {
            input[keydown.key] = true;
        }
    });
    window.addEventListener('keyup', keyup => {
        if(input.hasOwnPropert(keyup.key)) {
            input[keyup.key] = false;
        }
    });
    
    //loop, that's all I got to say
    const animate = timestamp => {

        //Next Frame, what you want more?
        window.requestAnimationFrame(animate);

        //Position, umm...
        const speed = 0.1;
        camera.rotation.y += speed / Math.PI * (input.ArrowLeft - input.ArrowRight);
        const velocity = new THREE.Vector3(speed * (input.a - input.d), 0, speed * (input.s - input.w));
        camera.position.x += velocity.x * -Math.cos(camera.rotation.y) + velocity.z * Math.sin(camera.rotation.y);
        camera.position.z += velocity.x * Math.sin(camera.rotation.y) + velocity.z * Math.cos(camera.rotation.y);

        //RayCasting, okay
        cube.material.color.set(0x0000FF);
        if(input.f) {
            const player_raycast = new THREE.Raycaster();
            player_raycast.setFromCamera(new THREE.Vector2(0, 0), camera);
            const intersects = player_raycast.intersectObjects(scene.children);
            intersects?.forEach(hit_object => {
                if(hit_object.object.name === 'hittable') {
                    hit_object.object.material.color.set(0xFF0000);
                }
             });
        }
        
        //Render, Pancakes?
        render.render(scene, camera);
    };
    window.requestAnimationFrame(animate);
});