import { Component } from '@angular/core';

declare var AFRAME: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'aframe-test';

  constructor(
  ){

    AFRAME.registerComponent('dragrable', { 
      init () {
        this.scene = this.el.sceneEl;
        this.camera = this.scene.camera;
        this.obj = this.el.object3D;
        this.zPosition = this.el.object3D.position.z;
        this.color = this.el.getAttribute("color");

        this.fromIntersectionToOrigin = null;
        this.initialRotation = null;
        this.clicked = false;

        const mousedownHandler = () => {
          console.log("mousedown");
          this.clicked = true;
        };
        const mouseupHandler = () => {
          console.log("mouseup");
          this.clicked = false;
        };

        this.el.addEventListener('mousedown', mousedownHandler); 
        this.el.addEventListener('mouseup', mouseupHandler); 

        this.el.addEventListener('raycaster-intersected', (e: any) => {
          this.raycaster = e.detail.el.components.raycaster;
          console.log("Intersection enter");
        });
        this.el.addEventListener('raycaster-intersected-cleared', () => {
          this.raycaster = null;
          console.log("Intersection leave");
        });
      },

      tick() {
        if (this.clicked) {
          this.el.setAttribute("color", "#fff");
          if (!this.raycaster) { return; }  // Not intersecting.
          let intersection = this.raycaster.getIntersection(this.el);
          if (!intersection) { return; }
          if (!this.fromIntersectionToOrigin) {
            this.fromIntersectionToOrigin = this.el.object3D.position.clone().sub(intersection.point);
          } else {
            this.el.object3D.position.copy(intersection.point.clone().add(this.fromIntersectionToOrigin));
            this.el.object3D.position.z = this.zPosition;
            if ( this.el.object3D.position.y < 0) {
              this.el.object3D.position.y = 0;
            }
            if ( this.el.object3D.position.y > 75) {
              this.el.object3D.position.y = 75;
            }
          }
        } else {
          this.fromIntersectionToOrigin = null;
          this.el.setAttribute("color", this.color);
        }
      }
    });


    AFRAME.registerComponent('rotable', { 
      init () {
        this.scene = this.el.sceneEl;
        this.camera = this.scene.camera;
        this.obj = this.el.object3D;
        this.zPosition = this.el.object3D.position.z;

        this.initialRotation = null;
        this.clicked = false;

        const mousedownHandler = () => {
          this.clicked = true;
        };
        const mouseupHandler = () => {
          this.clicked = false;
        };

        this.el.addEventListener('mousedown', mousedownHandler); 
        this.el.addEventListener('mouseup', mouseupHandler); 

        this.el.addEventListener('raycaster-intersected', (e: any) => {
          this.raycaster = e.detail.el.components.raycaster;
          console.log("Intersection enter");
        });
        this.el.addEventListener('raycaster-intersected-cleared', () => {
          console.log("Intersection leave");
        });
      },

      tick() {
        if (this.clicked) {
          const raycasterRotation = this.raycaster.raycaster.ray.direction.x;
          console.log(this.raycaster.raycaster.ray.direction);
          if (!this.initialRotation) {
            this.initialRotation = raycasterRotation;
          } else {
          this.el.setAttribute("color", "#fff");
          this.el.object3D.rotation.y += (raycasterRotation - this.initialRotation)/2;
          }
        } else {
          this.initialRotation = null;
          this.el.setAttribute("color", this.color);
        }
      }
    });


  }

  ngOnInit() {
  }

}
