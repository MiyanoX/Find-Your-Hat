const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(initialField) {
        this._field = initialField;
        this._x = 0;
        this._y = 0;
        this._xLength = initialField.length[0];
        this._yLength = initialField.length;
        this._win = false;
        this._lose = false;
    }

    generateField() {
        
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
            case 'u': {
                this._y -= 1;
                break;
            } 
            case 'd': {
                this._y += 1;
                break;
            }
            case 'l': {
                this._x -= 1;
                break;
            }
            case 'r': {
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
        this._field[this._y][this._x] = pathCharacter;
        for ( let i = 0; i < this._field.length; i += 1 ) {
            console.log(...this._field[i]);
        }
        this._field[this._y][this._x] = fieldCharacter;
    }

    resultPrint() {
        if (this._lose) {
            console.log("You Lose!");
            console.log('Please Try Again!');
        }
        if (this._win) {
            console.log('Congratulation! You Win!');
        }
    }
}

const newField = new Field(
    [   ['░', '░', 'O'],
        ['░', 'O', '░'],
        ['░', '^', '░'],]
)

newField.gameStart()