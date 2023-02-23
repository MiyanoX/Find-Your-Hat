const prompt = require('prompt-sync')({sigint: true});
const term = require( 'terminal-kit' ).terminal ;

const hat = '_A_';
const hole = '( )';
const fieldCharacter = '   ';
const pathCharacter = '<*>';

class Field {
    constructor({height, width, holePercentage}) {
        this._x = 0;
        this._y = 0;
        this._xLength = width;
        this._yLength = height;
        this._holePercentage = holePercentage;
        this._win = false;
        this._lose = false;
        this._field = [];
    }

    generateField(height, width, holePercentage) {
        const field = [];
        const randomWeight = {
            hole: {
                percentage: holePercentage, 
                text: hole,
            },
            fieldCharacter: {
                percentage: 1 - holePercentage,
                text: fieldCharacter,
            },
        }
        for (let i = 0; i < height; i += 1) {
            const line = [];
            for (let j = 0; j < width; j += 1) {
                var sum = 0;
                const random = Math.random();
                for (let weight in randomWeight) {
                    sum += randomWeight[weight].percentage; // use +weigth to tranform string to number
                    if (random < sum) {
                        line.push(randomWeight[weight].text);
                        break;
                    }
                }
            }
            field.push(line);
        }
        const endPoint = this.generatePointInField(field);
        field[endPoint[1]][endPoint[0]] = hat;
        const startPoint = this.generatePointInField(field);
        [this._x, this._y] = startPoint;
        return field;
    }

    generatePointInField(field) {
        let x = -1, y = -1;
        while (x === -1 || y === -1 || field[y][x] === hole || field[y][x] === hat){
            const randomX = Math.floor(Math.random() * this._xLength);
            const randomY = Math.floor(Math.random() * this._yLength);
            [x, y] = [randomX, randomY]
        }
        return [x, y];
    }

    gameStart() {
        let fieldValid = false;
        while(!fieldValid) {
            this._field = this.generateField(this._xLength, this._yLength, this._holePercentage);
            fieldValid = this.checkField()
        }
        while ( !this._win && !this._lose) {
            this.print();
            this.move(this.commandInput());
            this.checkGame();
        }
        this.resultPrint();
    }

    commandInput() {
        return prompt('Input your command:');
    }
    
    move(str) {
        switch(str) {
            case 'w': {
                this._y -= 1;
                break;
            } 
            case 's': {
                this._y += 1;
                break;
            }
            case 'a': {
                this._x -= 1;
                break;
            }
            case 'd': {
                this._x += 1;
                break;
            }
            default: {
                console.log('Wrong Command!');
            }
        }
    }

    checkGame() {
        if (this._x < 0 || this._x >= this._xLength || this._y < 0 || this._y >= this._yLength) {
            this._lose = true
            return;
        }
        const currentField = this._field[this._y][this._x];
        switch(currentField) {
            case hat: {
                this._win = true;
                break;
            }
            case hole: {
                this._lose = true;
                break;
            }
            case fieldCharacter: {
                break;
            }
            case pathCharacter: {
                break;
            }
            default: {
                console.log('Something went wrong with field!');
            }
        }
    }

    checkField() {
        const checkArray = JSON.parse(JSON.stringify(this._field));
        const startPoint = [this._x, this._y];
        const queue = [startPoint];

        const move = {
            up: [0, -1],
            down: [0, 1],
            left: [-1, 0],
            right: [1, 0],
        }

        while(queue.length > 0) {
            const [x, y] = queue.pop();
            if (checkArray[y][x] === hat) {
                return true;
            }
            checkArray[y][x] = hole;
            for (let i in move) {
                const [newX, newY] = [x + move[i][0], y + move[i][1]];
                if ( newX >= 0 && newY >= 0 && newX < this._xLength && newY < this._yLength && checkArray[newY][newX] !== hole) {
                    queue.push([newX, newY]);
                    // this.print(checkArray);
                }
            }
        }
        return false;
    }

    print(field=this._field) {
        for (let i = 0; i < 3; i += 1) {
            console.log('');
        }
        field[this._y][this._x] = pathCharacter;
        // for ( let i = 0; i < this._field.length; i += 1 ) {
        //     console.log(...this._field[i]);
        // }
        term.table( field , {
            hasBorder: false ,
            contentHasMarkup: true ,
            textAttr: { bgColor: 'blue' } , 
            width: this._xLength * 3,
            fit: true  // Activate all expand/shrink + wordWrap
        });

        field[this._y][this._x] = fieldCharacter;
    }

    resultPrint() {
        if (this._lose) {
            console.log('');
            console.log("You Lose!");
            console.log('Please Try Again!');
            console.log('');
        }
        if (this._win) {
            console.log('');
            console.log('----------------------------');
            console.log('| Congratulation! You Win! |');
            console.log('----------------------------');
            console.log('');
        }
    }
}


const gameParam = {
    height: 30,
    width: 30,
    holePercentage: 0.2,
}

const myGame = new Field(gameParam);
myGame.gameStart()