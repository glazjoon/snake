// KEYS
const Keys = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
};

Object.freeze(Keys);

// AREA
const Area = function (ctx, size)
{
    const clear = () =>
    {
        ctx.fillStyle = 'forestgreen';
        ctx.strokeStyle = 'black';

        ctx.fillRect(0, 0, size, size);
        ctx.strokeRect(0, 0, size, size);
    }

    return { clear };
}

// GAME
const Game = function (canvasId)
{
    const options = {
        gameSize: 500,
        snakeSize: 10
    }

    const canvas = document.querySelector(canvasId[0] === '#' ? canvasId : `#${canvasId}`);

    canvas.width = canvas.height = options.gameSize;

    const ctx = canvas.getContext('2d');

    const area = new Area(ctx, options.gameSize);
    const snake = new Snake(ctx, options);

    const addListeners = () =>
    {
        // Snake Controls
        document.addEventListener('keydown', evt =>
        {
            snake.turn(evt);
            console.log(evt.keyCode);
        });
    };

    const main = () =>
    {
        setTimeout(function onTick()
        {
            area.clear();
            snake.move();
            snake.draw();
            main();
        }, 80)
    }

    const start = () =>
    {
        main();
        addListeners();
    };

    return { start }
}

// SNAKE
const Snake = function (ctx, { gameSize, snakeSize })
{
    const parts = [];

    let dx = snakeSize;
    let dy = 0;

    let previousKeyCode = Keys.RIGHT;

    for (let i = 0; i < 5; i++)
    {
        parts.push({ x: gameSize / 2 - (i * snakeSize), y: gameSize / 2 })
    }

    const drawPart = ({ x, y }) =>
    {
        ctx.fillStyle = '#eac086';
        ctx.strokeStyle = 'black';

        ctx.beginPath();
        ctx.fillRect(x, y, snakeSize, snakeSize);
        ctx.strokeRect(x, y, snakeSize, snakeSize);
    };

    const draw = () =>
    {
        parts.forEach(drawPart);
    };

    const turn = ({ keyCode }) =>
    {
        switch (keyCode)
        {
            case Keys.UP:
                dy = -snakeSize;
                dx = 0;
                break;
            case Keys.DOWN:
                dy = snakeSize;
                dx = 0;
                break;
            case Keys.LEFT:
                dx = -snakeSize;
                dy = 0;
                break;
            case Keys.RIGHT:
                dx = snakeSize;
                dy = 0;
                break;
        }

        previousKeyCode = keyCode;
    };

    const move = () =>
    {
        parts.unshift({ x: parts[0].x + dx, y: parts[0].y + dy });
        parts.pop();
    }

    return { draw, move, turn };
};

const game = new Game('#game');

document.addEventListener('DOMContentLoaded', game.start);