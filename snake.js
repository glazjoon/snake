const Snake = function (ctx, { gameSize, squareSize })
{
    const parts = [];

    let dx = squareSize;
    let dy = 0;

    let currentDirection = Direction.RIGHT;

    for (let i = 0; i < 5; i++)
    {
        parts.push({ x: gameSize.w / 2 - (i * squareSize), y: gameSize.h / 2 })
    }

    const getCoords = ({ x, y }) => ([
        { x, y },
        { x: x + squareSize, y },
        { x: x + squareSize, y: y + squareSize },
        { x, y: y + squareSize }
    ])

    const isConnectingVector = (c1, c2, connectingPart) =>
    {
        return connectingPart.some(c => c.x === c1.x && c.y === c1.y)
            && connectingPart.some(c => c.x === c2.x && c.y === c2.y);
    }

    const drawPart = (part, partIndex) =>
    {
        const
            nextPart = parts[partIndex + 1],
            prevPart = parts[partIndex - 1],
            partCoords = getCoords(part);

        let
            prevPartCoords = prevPart ? getCoords(prevPart) : null,
            nextPartCoords = nextPart ? getCoords(nextPart) : null

        for (let i = 0; i < partCoords.length; i++)
        {
            const last = i === partCoords.length - 1;

            const { x: partX, y: partY } = coord = partCoords[i];
            const { x: nextX, y: nextY } = nextCoord = last ? partCoords[0] : partCoords[i + 1];

            ctx.moveTo(partX, partY);

            const connectsWithNextPart = nextPart && isConnectingVector(coord, nextCoord, nextPartCoords);
            const connectsWithPreviousPart = prevPart && isConnectingVector(coord, nextCoord, prevPartCoords);

            if (connectsWithNextPart || connectsWithPreviousPart)
            {
                ctx.moveTo(nextX, nextY);
            }
            else
            {
                ctx.lineTo(nextX, nextY);
            }
        }
    }

    const draw = () =>
    {
        ctx.beginPath();

        ctx.lineWidth = 2;

        parts.forEach(drawPart);

        ctx.strokeStyle = 'white';
        ctx.stroke();

        ctx.lineWidth = 1;
        ctx.closePath();
    }

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
        const outOfBounds = x < 0 || x > gameSize.w - squareSize || y < 0 || y > gameSize.h - squareSize;

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

        currentDirection = direction;
    };

    const move = () =>
    {
        parts.unshift({ x: parts[0].x + dx, y: parts[0].y + dy });
        parts.pop();

        return parts[0];
    }

    return { draw, grow, lives, move, occupies, turn };
};