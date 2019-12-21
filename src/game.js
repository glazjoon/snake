const Game = function (userOptions)
{
    const defaultOptions = {
        canvasId: '#snakeGame',
        gameSize: { w: 600, h: 600 },
        showGrid: false,
        squareSize: 20
    };

    const options = Object.assign(defaultOptions, userOptions);
    const { canvasId, gameSize, squareSize } = options;

    const canvas = document.querySelector(canvasId[0] === '#' ? canvasId : `#${canvasId}`);

    canvas.width = gameSize.w;
    canvas.height = gameSize.h;

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
        return {
            x: roundToNearestMultipleOf(squareSize, getRandomInt(0, options.gameSize.w - options.squareSize)),
            y: roundToNearestMultipleOf(squareSize, getRandomInt(0, options.gameSize.h - options.squareSize))
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

const Direction = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
};

Object.freeze(Direction);