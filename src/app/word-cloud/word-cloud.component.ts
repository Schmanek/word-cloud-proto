import { Component, HostListener, OnInit } from '@angular/core';
import { Bodies, Body, Composite, Constraint, Engine, MouseConstraint, Render, Runner, Events, Mouse, Bounds } from 'matter-js';
import * as MatterAttractors from 'matter-attractors';
import * as Matter from 'matter-js';

@Component({
  selector: 'app-word-cloud',
  templateUrl: './word-cloud.component.html',
  styleUrls: ['./word-cloud.component.css']
})
export class WordCloudComponent implements OnInit {
  engine: Engine | undefined;
  render: Render | undefined;
  center: Body | undefined;
  mouse! : Mouse; // ! sagt das man davon ausgeht, dass es immer defined is wenn es benutzt wird

  canvasWidth: number = 1000;
  canvasHeight: number = 500;

  @HostListener("document:keypress", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.engine && event.key === "a"){
      Composite.add(this.engine.world, Bodies.circle(20 ,20, 20));
    }
    if (this.engine && event.key === "l" && this.center && this.center) {
      Body.scale(this.center, 1.5, 1.5)
      console.log("yo");
    }
    if (this.engine && event.key === "s" && this.center && this.center) {
      Body.scale(this.center, 0.5, 0.5)
      console.log("yo");
    }
    if (this.engine && event.key === "f"){
      Composite.add(this.engine.world, Bodies.circle(20 ,20, 80, {mass: 100, inverseMass: 1/100}));
    }
  }

  constructor() {}

  ngOnInit(): void {
    Matter.use(MatterAttractors);

    this.engine = Engine.create();
    this.engine.gravity.y = 0;

    this.render = Render.create({engine: this.engine, canvas: document.getElementById("word-cloud-canvas") as HTMLCanvasElement, options: {width: this.canvasWidth, height: this.canvasHeight}});

    const components: Array<Body | Composite | Constraint | MouseConstraint> = [];

    this.center = Bodies.circle(this.canvasWidth/2, this.canvasHeight/2, 30, {isStatic: true, isSensor: false, plugin: {
      attractors: [function(bodyA: Body, bodyB: Body) {
        return {
          x: (bodyA.position.x - bodyB.position.x) * 4e-6 * (bodyB.mass * 0.5),
          y: (bodyA.position.y - bodyB.position.y) * 4e-6 * (bodyB.mass * 0.5),
        };
      }]
    }})

    components.push(this.center);

    //components.push(MouseConstraint.create(this.engine, {mouse: Matter.Mouse.create(this.render.canvas)}));

    components.push(Bodies.circle(20, 20, 20));

    Composite.add(this.engine.world, components);

    this.mouse = Mouse.create(this.render.canvas);

    Events.on(this.engine, "beforeUpdate", (e: Matter.IEventTimestamped<Engine>) => {
      var allBodies = Composite.allBodies(e.source.world);
      if (this.mouse.button === 0) {
        for (const body of allBodies) {
          if (Bounds.contains(body.bounds, this.mouse.position)) {
            Body.scale(body, 1.01, 1.01);
          }
        }
      }
    });

    Render.run(this.render);

    const runner: Runner = Runner.create();

    Runner.run(runner, this.engine);
  }
}
