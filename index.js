// Helpers
const getRandomInt = (min, max) =>
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const roundToNearestMultipleOf = (multiple, numberToRound) =>
{
    return Math.ceil(numberToRound / multiple) * multiple;
}

// Direction
const Direction = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
};

Object.freeze(Direction);

// AREA
const Area = function (ctx, options)
{
    const { gameSize, squareSize, showGrid } = options;

    const clear = () => draw();

    const drawGrid = () =>
    {
        ctx.beginPath();

        ctx.strokeStyle = 'green';

        for (let i = squareSize; i < gameSize; i += squareSize)
        {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, gameSize);

            ctx.moveTo(0, i);
            ctx.lineTo(gameSize, i);
        }

        ctx.stroke();

        ctx.closePath();
    };

    const draw = () =>
    {
        ctx.fillStyle = 'forestgreen';
        ctx.strokeStyle = 'black';

        ctx.fillRect(0, 0, gameSize, gameSize);
        ctx.strokeRect(0, 0, gameSize, gameSize);

        if (showGrid)
        {
            drawGrid();
        }
    }

    return { clear, draw };
}

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

// GAME
const Game = function (userOptions)
{
    const defaultOptions = {
        canvasId: '#snakeGame',
        gameSize: 450,
        showGrid: false,
        squareSize: 15
    };

    const options = Object.assign(defaultOptions, userOptions);
    const { canvasId, gameSize, squareSize } = options;

    const canvas = document.querySelector(canvasId[0] === '#' ? canvasId : `#${canvasId}`);

    canvas.width = canvas.height = gameSize;

    const ctx = canvas.getContext('2d');

    const area = new Area(ctx, options);
    let snake = new Snake(ctx, options);
    let fruit;

    let score = 0;

    const addListeners = () =>
    {
        document.addEventListener('keydown', evt =>
        {
            snake.turn(evt.keyCode);
        });
    };

    const getRandomSquare = () =>
    {
        const max = options.gameSize - options.squareSize;

        return {
            x: roundToNearestMultipleOf(squareSize, getRandomInt(0, max)),
            y: roundToNearestMultipleOf(squareSize, getRandomInt(0, max))
        }
    };

    const getUnoccupiedSquare = () =>
    {
        let square = getRandomSquare();

        while (snake.occupies(square))
        {
            square = getRandomSquare();
        }

        return square;
    };

    const main = () =>
    {
        setTimeout(function onTick()
        {
            snake.move();

            if (snake.occupies(fruit.getPosition()))
            {
                score++;
                snake.grow();

                fruit.move(getUnoccupiedSquare());
                console.log(fruit.getPosition());
            }

            area.clear()

            if (snake.lives())
            {
                fruit.draw();
                snake.draw();
            }
            else
            {
                location.reload();
            }

            main();
        }, 80)
    }

    const start = () =>
    {
        fruit = new Fruit(ctx, getUnoccupiedSquare(), options);
        main();
        addListeners();
    };

    return { start }
}

// SNAKE
const Snake = function (ctx, { gameSize, squareSize })
{
    const parts = [];

    let dx = squareSize;
    let dy = 0;

    for (let i = 0; i < 5; i++)
    {
        parts.push({ x: gameSize / 2 - (i * squareSize), y: gameSize / 2 })
    }

    const drawPart = ({ x, y }) =>
    {
        ctx.fillStyle = '#eac086';
        ctx.strokeStyle = 'black';

        ctx.beginPath();
        ctx.fillRect(x, y, squareSize, squareSize);
        ctx.strokeRect(x, y, squareSize, squareSize);
    };

    const draw = () =>
    {
        parts.forEach(drawPart);
    };

    const grow = () =>
    {
        const { x, y } = parts[parts.length - 1];

        parts.push({ x: x + squareSize, y });
    };

    const occupies = ({ x, y }) => parts.some(p => p.x === x && p.y === y);

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
                dy = -squareSize;
                dx = 0;
                break;
            case Direction.DOWN:
                dy = squareSize;
                dx = 0;
                break;
            case Direction.LEFT:
                dx = -squareSize;
                dy = 0;
                break;
            case Direction.RIGHT:
                dx = squareSize;
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

    return { draw, grow, lives, move, occupies, turn };
};

const game = new Game({ canvasId: '#game', showGrid: true });

document.addEventListener('DOMContentLoaded', game.start);