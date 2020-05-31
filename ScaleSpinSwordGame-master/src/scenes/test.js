var Engine = Matter.Engine,
  Render = Matter.Render,
  Composites = Matter.Composites,
    Composite = Matter.Composite,
  Mouse = Matter.Mouse,
  World = Matter.World,
  Constraint = Matter.Constraint,
  Bodies = Matter.Bodies,
  Body = Matter.Body;

// create engine
var engine = Engine.create(), world = engine.world;

// create renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 400,
    wireframes: false
  }
});

Engine.run(engine);

Render.run(render);

var car = Composites.car(190, 100, 100, 45, 30);

var boxes = Composites.stack(500, 80, 3, 1, 10, 0, function(x, y) {
        return Bodies.rectangle(x, y, 50, 40);
    });

var chain = Composites.chain(boxes, 0.5, 0, -0.5, 0, { stiffness: 1});

Composite.add(boxes, Constraint.create({ 
        bodyA: boxes.bodies[0],
        pointB: { x: 500, y: 15 },
        stiffness: 0.8
    }));

World.add(world, [
  car,
  chain,
  // walls
  Bodies.rectangle(400, 0, 810, 30, { isStatic: true }),
  Bodies.rectangle(400, 400, 810, 30, { isStatic: true }),
  Bodies.rectangle(800, 200, 30, 420, { isStatic: true }),
  Bodies.rectangle(0, 200, 30, 420, { isStatic: true })
]);

$('.force').on('click', function () {
    Body.applyForce( car.bodies[0], {x: car.bodies[0].position.x, y: car.bodies[0].position.y}, {x: 0.5, y: 0});
});


$('.vforce').on('click', function () {
    Body.applyForce( car.bodies[0], {x: car.bodies[0].position.x, y: car.bodies[0].position.y}, {x: -0.5, y: 0});
});
