const Area = function (ctx, options)
{
    const { gameSize, squareSize, showGrid } = options;

    const clear = () => draw();

    const drawGrid = () =>
    {
        ctx.beginPath();

        ctx.strokeStyle = 'green';

        for (let i = squareSize; i < gameSize.w; i += squareSize)
        {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, gameSize.h);
        }

        for (let i = squareSize; i < gameSize.h; i += squareSize)
        {
            ctx.moveTo(0, i);
            ctx.lineTo(gameSize.w, i);
        }

        ctx.stroke();

        ctx.closePath();
    };

    const draw = () =>
    {
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'red';

        ctx.clearRect(0, 0, gameSize.w, gameSize.h);

        if (showGrid)
        {
            drawGrid();
        }
    }

    return { clear, draw };
}