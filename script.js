"use strict";
/* Card */
class Card {
    constructor(text) {
        this.element = document.createElement('div');
        this.element.classList.add('card');
        this.element.innerHTML = text;
        document.querySelector('.container').appendChild(this.element);
        this.element.addEventListener('mousedown', () => {
            this.element.classList.add('cursor');
        });
        this.element.addEventListener('mouseup', () => {
            this.element.classList.remove('cursor');
        });
        const { width, height } = this.element.getBoundingClientRect();
        this.width = width;
        this.height = height;
        const left = (Math.random() * window.innerWidth);
        const top = (Math.random() * (window.innerHeight / 6)) + height;
        this.body = Bodies.rectangle(left, top, width, height, { restitution: .8 });
    }
    render() {
        const { x, y } = this.body.position;
        this.element.style.top = `${y - (this.height / 2)}px`;
        this.element.style.left = `${x - (this.width / 2)}px`;
        this.element.style.transform = `rotate(${this.body.angle}rad)`;
    }
}
/* Module aliases */
const Engine = Matter.Engine, Bodies = Matter.Bodies, Mouse = Matter.Mouse, MouseConstraint = Matter.MouseConstraint, Composite = Matter.Composite;
/* Engine*/
const engine = Engine.create();
/* List of texts to form cards */
const textList = ['Tikusruk', 'Tijengkang', 'Tikosewad', 'Tijungkel', 'Tigolosor', 'Tigebrus', 'Tiseureuleu', 'Tigedebru', 'Tigubrag', 'Ticengklak', 'Tigejebur', 'Tisoledat', 'Tigorolong', 'Tikucuprak', 'Tigulitik', 'Tigurawil', 'Tigolepak', 'Ngagulutuk', 'Tijalikeuh', 'Ngajungkel', 'Tikudawet', 'Titiliktikan', 'Titotolonjong', 'Tisorodot', 'Titajong', 'Ngajungkel', 'Ngagolosor', 'Ngabugrak', 'Tigujubar'];
/* Constants */
let allCards = [], ground, wallLeft, wallRight, ceiling;
/* createEnvironment */
function createEnvironment() {
    if (allCards.length > 0) {
        emptyEnvironment();
    }
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    };
    // Create all cards
    allCards = textList.map(txt => new Card(txt));
    // grounds, walls and ceiling
    ground = Bodies.rectangle(sizes.width / 2, sizes.height + 400, sizes.width, 800, {
        isStatic: true,
        collisionFilter: { category: 0x0001, mask: 0x0001 },
        restitution: 2
    });
    wallLeft = Bodies.rectangle(-400, sizes.height / 2, 800, sizes.height, { isStatic: true });
    wallRight = Bodies.rectangle(sizes.width + 400, sizes.height / 2, 800, sizes.height, { isStatic: true });
    ceiling = Bodies.rectangle(sizes.width / 2, -400, sizes.width, 800, { isStatic: true });
    Composite.add(engine.world, [ceiling, wallLeft, wallRight, ground, ...allCards.map(each => each.body)]);
}
function emptyEnvironment() {
    Composite.remove(engine.world, [ceiling, wallLeft, wallRight, ground, ...allCards.map(each => each.body)]);
    const container = document.querySelector('.container');
    container.innerHTML = '';
    allCards = [];
}
/* Mouse constraint */
const mouse = Mouse.create(document.querySelector('.container'));
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: true,
        }
    },
});
Composite.add(engine.world, mouseConstraint);
Matter.Events.on(engine, 'beforeUpdate', () => {
    let maxSpeed = 70;
    allCards.forEach(({ body }) => {
        if (body.velocity.x > maxSpeed) {
            Matter.Body.setVelocity(body, { x: maxSpeed, y: body.velocity.y });
        }
        if (body.velocity.x < -maxSpeed) {
            Matter.Body.setVelocity(body, { x: -maxSpeed, y: body.velocity.y });
        }
        if (body.velocity.y > maxSpeed) {
            Matter.Body.setVelocity(body, { x: body.velocity.x, y: maxSpeed });
        }
        if (body.velocity.y < -maxSpeed) {
            Matter.Body.setVelocity(body, { x: -body.velocity.x, y: -maxSpeed });
        }
    });
});
// onclick button
const button = document.querySelector('button');
button.onclick = () => {
    createEnvironment();
};
function run() {
    allCards.forEach(card => card.render());
    Matter.Engine.update(engine);
    window.requestAnimationFrame(run);
}
createEnvironment();
run();