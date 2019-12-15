const Snake = function (ctx)
{
    const drawPart = part =>
    {

    };

    const draw = () =>
    {

    };

    const move = (dx = 0, dy = 0) =>
    {
        snake.unshift({ x: snake[0].x + dx, y: snake[0].y + dy });
        snake.pop();
    }
};