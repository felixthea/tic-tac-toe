// NB: This doesn't include any AI.

(function (root) {



  var TTT = root.TTT = (root.TTT || {});

  var Game = TTT.Game = function TT() {
    this.player = Game.marks[0];
    this.board = this.makeBoard();

    this.addHandler();
  }

  Game.marks = ["x", "o"];

  Game.prototype.addHandler = function () {
    var that = this;
    console.log('set click');
    $('span').on('click', function(event) {
      var x = $(this).parent().index();
      var y = $(this).index();

      that.turn([x,y]);
    });
  }

  Game.prototype.diagonalWinner = function () {
    var game = this;

    var diagonalPositions1 = [[0, 0], [1, 1], [2, 2]];
    var diagonalPositions2 = [[2, 0], [1, 1], [0, 2]];

    var winner = null;
    _(Game.marks).each(function (mark) {
      function didWinDiagonal (diagonalPositions) {
        return _.every(diagonalPositions, function (pos) {
          return game.board[pos[0]][pos[1]] === mark;
        });
      }

      var won = _.any(
        [diagonalPositions1, diagonalPositions2],
        didWinDiagonal
      );

      if (won) {
        winner = mark;
      }
    });

    return winner;
  };

  Game.prototype.isEmptyPos = function (pos) {
    return (this.board[pos[0]][pos[1]] === null);
  };

  Game.prototype.horizontalWinner = function () {
    var game = this;

    var winner = null;
    _(Game.marks).each(function (mark) {
      var indices = _.range(0, 3);

      var won = _(indices).any(function (i) {
        return _(indices).every(function (j) {
          return game.board[i][j] === mark;
        });
      });

      if (won) {
        winner = mark;
      }
    });

    return winner;
  };

  Game.prototype.makeBoard = function () {
    return _.times(3, function (i) {
      return _.times(3, function (j) {
        return null;
      });
    });
  };

  Game.prototype.move = function (pos) {
    if (!this.isEmptyPos(pos)) {
      return false;
    }

    this.placeMark(pos);
    this.switchPlayer();
    return true;
  };

  Game.prototype.placeMark = function (pos) {
    this.board[pos[0]][pos[1]] = this.player;
  };

  Game.prototype.switchPlayer = function () {
    if (this.player === Game.marks[0]) {
      this.player = Game.marks[1];
    } else {
      this.player = Game.marks[0];
    }
  };

  Game.prototype.valid = function (pos) {
    // Check to see if the co-ords are on the board and the spot is
    // empty.

    function isInRange (pos) {
      return (0 <= pos) && (pos < 3);
    }

    return _(pos).all(isInRange) && _.isNull(this.board[pos[0]][pos[1]]);
  };

  Game.prototype.verticalWinner = function () {
    var game = this;

    var winner = null;
    _(Game.marks).each(function (mark) {
      var indices = _.range(0, 3);

      var won = _(indices).any(function (j) {
        return _(indices).every(function (i) {
          return game.board[i][j] === mark;
        });
      });

      if (won) {
        winner = mark;
      }
    });

    return winner;
  };

  Game.prototype.winner = function () {
    return (
      this.diagonalWinner() || this.horizontalWinner() || this.verticalWinner()
    );
  };

  Game.prototype.printBoard = function () {
    var game = this;
    var mark = '';
    var xInt;
    var yInt;
    var markPos;
    game.board.forEach(function(row, x){
      row.forEach( function(square, y){
        xInt = parseInt(x + 1);
        yInt = parseInt(y + 1);
        mark = square == null ? '' : square;

        markPos = $('#board div:nth-child('+ xInt +') span:nth-child(' + yInt + ')');
        markPos.html( mark );
      });
    });
  }

  Game.prototype.run = function () {
    var game = this;
    game.printBoard();
    if (game.winner()) {
      $('span').off();
      alert('Somebody won!');
    } else {
      console.log("Click a square!");
    };
  }

  Game.prototype.turn = function (coords) {
    var game = this;
    if (game.valid(coords)) {
      game.move(coords);
      game.run();
    } else {
      console.log("Invalid coords!");
    }
  }
})(this);


// First we instantiate a new object with the this.TTT.Game() constructor function.
var that = this;
$(document).ready(function(){
  var TTT = new that.TTT.Game();
  TTT.run();
});

// Then we enter the game's run loop.
