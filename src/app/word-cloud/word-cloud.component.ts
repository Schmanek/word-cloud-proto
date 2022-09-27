import { Component, HostListener, OnInit } from '@angular/core';
import { Bodies, Body, Composite, Constraint, Engine, MouseConstraint, Render, Runner } from 'matter-js';
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

  canvasWidth: number = 1000;
  canvasHeight: number = 500;

  @HostListener("document:keypress", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.createBody();
  }

  public createBody(): void {
    if(this.engine){
      const value: number = this.getRandomArbitrary(2, 50);
      Composite.add(this.engine.world, Bodies.circle(0,0, value, {
        restitution: 0,mass: value,
        // inverseMass: 1-value,
        inertia: Number.POSITIVE_INFINITY,
        
        friction: 0,
      }) );
    }
  }

  constructor() { }

  ngOnInit(): void {
    Matter.use(MatterAttractors);

    this.engine = Engine.create();
    this.engine.gravity.y = 0;

    this.render = Render.create({engine: this.engine, canvas: document.getElementById("word-cloud-canvas") as HTMLCanvasElement, options: {width: this.canvasWidth, height: this.canvasHeight}});

    const components: Array<Body | Composite | Constraint | MouseConstraint> = [];

    components.push(Bodies.circle(this.canvasWidth/2, this.canvasHeight/2, 2, {isStatic: true, collisionFilter: {
      group: 0,
      category: 0
    },  plugin: {
      attractors: [function(bodyA: Body, bodyB: Body) {
        var force = {
          x: (bodyA.position.x - bodyB.position.x) * 1e-6,
          y: (bodyA.position.y - bodyB.position.y) * 1e-6,
        };

        // apply force to both bodies
        Body.applyForce(bodyA, bodyA.position, Matter.Vector.neg(force));
        Body.applyForce(bodyB, bodyB.position, force);
    }]
    }}));

    components.push(MouseConstraint.create(this.engine, {mouse: Matter.Mouse.create(this.render.canvas)}));

    this.createBody();


    Composite.add(this.engine.world, components);

    Render.run(this.render);

    const runner: Runner = Runner.create();

    Runner.run(runner, this.engine);
  }

  public getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
}
