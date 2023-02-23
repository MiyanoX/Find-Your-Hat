const prompt = require('prompt-sync')({sigint: true});
const term = require( 'terminal-kit' ).terminal ;

const hat = '_A_';
const hole = '( )';
const fieldCharacter = '   ';
const pathCharacter = '<*>';

class Field {
    constructor(height=30, weight=30, holePercentage=0.2) {
        this._x = 0;
        this._y = 0;
        this._xLength = weight;
        this._yLength = height;
        this._win = false;
        this._lose = false;
        this._field = this.generateField(height, weight,holePercentage);
    }

    generateField(height, width, holePercentage) {
        const field = [];
        const randomWeight = {
            [holePercentage]: hole,
            [1 - holePercentage]: fieldCharacter,
        }
        for (let i = 0; i < height; i += 1) {
            const line = [];
            for (let j = 0; j < width; j += 1) {
                var sum = 0;
                const random = Math.random();
                for (let weight in randomWeight) {
                    sum += +weight; // use +weigth to tranform string to number
                    if (random < sum) {
                        line.push(randomWeight[weight]);
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

    print() {
        for (let i = 0; i < 3; i += 1) {
            console.log('');
        }
        this._field[this._y][this._x] = pathCharacter;
        // for ( let i = 0; i < this._field.length; i += 1 ) {
        //     console.log(...this._field[i]);
        // }
        term.table( this._field , {
            hasBorder: false ,
            contentHasMarkup: true ,
            textAttr: { bgColor: 'blue' } , 
            width: this._xLength * 3,
            fit: true  // Activate all expand/shrink + wordWrap
        }
    ) ;
        this._field[this._y][this._x] = fieldCharacter;
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


const myGame = new Field();
myGame.gameStart()