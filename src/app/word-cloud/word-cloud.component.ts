import { Component, OnInit } from '@angular/core';
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

  constructor() { }

  ngOnInit(): void {
    Matter.use(MatterAttractors);

    this.engine = Engine.create();
    this.engine.gravity.y = 0;

    this.render = Render.create({engine: this.engine, canvas: document.getElementById("word-cloud-canvas") as HTMLCanvasElement, options: {width: this.canvasWidth, height: this.canvasHeight}});

    const components: Array<Body | Composite | Constraint | MouseConstraint> = [];

    components.push(Bodies.circle(this.canvasWidth/2, this.canvasHeight/2, 40, {isStatic: true, plugin: {
      attractors: [function(bodyA: Body, bodyB: Body) {
        return {
          x: (bodyA.position.x - bodyB.position.x) * 1e-6,
          y: (bodyA.position.y - bodyB.position.y) * 1e-6,
        };
      } ]
    }}));

    components.push(Bodies.circle(20, 20, 30 ));

    Composite.add(this.engine.world, components);

    Render.run(this.render);

    const runner: Runner = Runner.create();

    Runner.run(runner, this.engine);
  }
}
