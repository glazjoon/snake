// Direction
const Direction = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
};

Object.freeze(Direction);

// AREA
const Area = function (ctx, size)
{
    const drawGrid = () =>
    {
        ctx.beginPath();

        ctx.strokeStyle = 'green';

        for (let i = 10; i < size; i += 10)
        {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, size);

            ctx.moveTo(0, i);
            ctx.lineTo(size, i);
        }

        ctx.stroke();

        ctx.closePath();
    };

    const clear = () => draw();

    const draw = () =>
    {
        ctx.fillStyle = 'forestgreen';
        ctx.strokeStyle = 'black';

        ctx.fillRect(0, 0, size, size);
        ctx.strokeRect(0, 0, size, size);

        drawGrid();
    }

    return { clear };
}

const Fruit = function (ctx, size, x, y)
{
    const draw = () =>
    {
        ctx.beginPath();

        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'darkred';

        ctx.arc(x - size / 2, y - size / 2, size / 2, 0, 2 * Math.PI)
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    return { draw }
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
    let snake = new Snake(ctx, options);

    const addListeners = () =>
    {
        // Snake Controls
        document.addEventListener('keydown', evt =>
        {
            snake.turn(evt.keyCode);
        });
    };

    const getRandomInt = (min, max) =>
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const toNearestMultipleOfTen = numberToRound =>
    {
        return Math.ceil(numberToRound / 10) * 10;
    };

    const getRandomMultipleOfTen = () =>
    {
        return toNearestMultipleOfTen(getRandomInt(0, options.gameSize));
    }

    const getUnoccupiedCoordinate = () =>
    {
        const coord = { x, y } = {
            x: getRandomMultipleOfTen(),
            y: getRandomMultipleOfTen()
        };

        while (snake.occupies(x, y))
        {
            coord = getRandomMultipleOfTen();
        }

        return coord;
    }

    const main = () =>
    {
        setTimeout(function onTick()
        {
            snake.move();

            if (snake.lives())
            {
                area.clear();
                fruit.draw();
                snake.draw();
            }
            else
            {
                area.clear();
                snake = new Snake(ctx, options);
                snake.draw();
            }

            main();
        }, 80)
    }

    const start = () =>
    {
        const { x, y } = getUnoccupiedCoordinate();

        fruit = new Fruit(ctx, options.snakeSize, x, y);
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

    const occupies = (x, y) => parts.some(p => p.x === x && p.y === y);

    const lives = () =>
    {
        const { x, y } = parts[0];

        const intersect = parts.slice(1).some(p => p.x === x && p.y === y);
        const outOfBounds = x < 0 || x > gameSize || y < 0 || y > gameSize;

        return !intersect && !outOfBounds;
    };

    const turn = direction =>
    {
        switch (direction)
        {
            case Direction.UP:
                dy = -snakeSize;
                dx = 0;
                break;
            case Direction.DOWN:
                dy = snakeSize;
                dx = 0;
                break;
            case Direction.LEFT:
                dx = -snakeSize;
                dy = 0;
                break;
            case Direction.RIGHT:
                dx = snakeSize;
                dy = 0;
                break;
        }
    };

    const move = () =>
    {
        parts.unshift({ x: parts[0].x + dx, y: parts[0].y + dy });
        parts.pop();

        return parts[0];
    }

    return { draw, occupies, lives, move, turn };
};

const game = new Game('#game');

document.addEventListener('DOMContentLoaded', game.start);