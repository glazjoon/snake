const Fruit = function (ctx, position, options)
{
    const { squareSize } = options;

    let { x, y } = position;

    const draw = () =>
    {
        ctx.beginPath();

        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'darkred';

        const radius = squareSize / 2;

        ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI)

        ctx.fill();
        ctx.stroke();

        ctx.closePath();
    }

    const getPosition = () => ({ x, y });

    const move = ({ x: newX, y: newY }) =>
    {
        x = newX;
        y = newY;
    };

    return { draw, move, getPosition }
}