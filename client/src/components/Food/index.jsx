class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 4;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffcc00';
        ctx.fill();
        ctx.closePath();
    }
}

export default Food;