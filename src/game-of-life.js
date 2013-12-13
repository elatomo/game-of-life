'use strict';

/**
 * Conway's Game Of Life (23/3)
 * ============================
 *
 * Check the [wikipedia entry](http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).
 *
 * The Life world is represented using a _toroidal array_, so the active areas
 * that move across a world edge reappear at the opposite edge:
 *
 *      15  | 12 13 14 15 | 12
 *      ----------------------
 *       3  |  0  1  2  3 |  0
 *      11  |  8  9 10 11 |  8
 *      15  | 12 13 14 15 | 12
 *      ----------------------
 *       3  |  0  1  2  3 |  0
 * 
 * Running the game
 * ----------------
 *
 * Running the game with default configuration is a matter of:
 *
 *     GOL.game.start();
 *
 * Or, for starting a game and pausing it on the first frame:
 *
 *     GOL.game.start().pause();
 *     GOL.game.nextFrame(); // to display next game frame
 *     GOL.game.resume(); // to resume animation
 *
 * @module gol
 */
var GOL = GOL || { };

/**
 * Game controller
 *
 * @class game
 * @static
 */
GOL.game = (function(myApp, global) {

  /**
   * Default game configuration.
   *
   * @property config
   * @type Object
   * @private
   */
  var config = {
    canvasId: 'gol',
    worldWidth: 300,
    worldHeight: 200,
    cellWidth: 20,
    cellColor: 'black',
    fps: 15
  };

  /**
   * @property isActive
   * @type Boolean
   * @private
   */
  var isActive = false;

  /**
   * @property isInitialized
   * @type Boolean
   * @private
   */
  var isInitialized = false;

  /**
   * @property world
   * @type World
   * @private
   */
  var world = null;

  /**
   * HTML5 canvas used in the game.
   *
   * @property canvas
   * @type Object
   * @private
   */
  var canvas = null;

  /**
   * Canvas context.
   *
   * @property context
   * @type Object
   * @private
   */
  var context = null;

  /**
   * Initialize game.
   *
   * @method init
   * @private
   */
  var init = function() {
    // set up canvas and context
    canvas = global.document.getElementById(config['canvasId']);
    myApp.validateCanvas(canvas);
    canvas.width = config.worldWidth;
    canvas.height = config.worldHeight;

    context = canvas.getContext('2d');
    myApp.validateContext(context);

    // initialize world
    world = new myApp.World(
        Math.floor(config.worldHeight / config.cellWidth), // rows
        Math.floor(config.worldWidth / config.cellWidth),  // columns
        config.cellWidth,
        config.cellColor
    );
    world.init();

    isInitialized = true;
  };

  /**
   * Animate.
   *
   * @method animate
   * @private
   */
  var animate = function() {
    global.window.setTimeout(function() {
      if (isActive) {
        world.clear(context);
        world.draw(context);
        world.update();

        global.window.requestAnimationFrame(animate);
      }
    }, 1000 / config.fps);
  };

  // public API
  return {
    /**
     * Modify default game configuration.
     *
     * @method configure
     * @static
     * @chainable
     * @param {Object} userConfig Configuration object for overriding one or
     * more default options.
     *
     * Object possible attributes and default values:
     * - `canvasId` : Id of the html5  canvas to be used by the game. Defaults to `gol`.
     * - `worldWidth`: world width in pixels. Defaults to 300.
     * - `worldHeight`: world height in pixels. Defaults to 200.
     * - `cellWidth`: cell width in pixels. Defaults to 20.
     * - `cellColor`: color for new cells. Defaults to `black`.
     * - `fps`: frames per second. Defaults to `15`.
     */
    configure: function(userConfig) {
      if (isInitialized) {
        throw new Error("Can't re-configure a running game. Please, stop it first")
      }

      for (var prop in userConfig) {
        if (config.hasOwnProperty(prop)) {
          config[prop] = userConfig[prop];
        }
      }
      return this;
    },

    /**
     * Retrieve current configuration.
     *
     * @method getConfig
     * @static
     * @return {Object} Current game configuration
     */
    getConfig: function() {
      return config;
    },

    /**
     * Start the game.
     *
     * @method start
     * @static
     * @chainable
     */
    start: function() {
      if (!isInitialized) init();
      isActive = true;
      animate();
      return this;
    },

    /**
     * Stop the game.
     *
     * @method stop
     * @static
     * @chainable
     */
    stop: function() {
      world.clear(context);
      isActive = false;
      isInitialized = false;
      world = null;
      return this;
    },

    /**
     * Pause the game.
     *
     * @method pause
     * @static
     * @chainable
     */
    pause: function() {
      isActive = false;
      return this;
    },

    /**
     * Resume a paused game.
     *
     * @method resume
     * @static
     * @chainable
     */
    resume: function() {
      isActive = true;
      animate();
      return this;
    },

    /**
     * Display next game frame.
     *
     * @method nextFrame
     * @static
     * @chainable
     */
    nextFrame: function() {
      return this.resume().pause();
    },

    /**
     * Get game world.
     *
     * @method getWorld
     * @static
     * @return {World} World object used in the game.
     */
    getWorld: function() {
      return world;
    }
  };
}(GOL, this));

/**
 * A cells world.
 *
 * @class World
 * @constructor
 * @param {Integer} rows Number of rows
 * @param {Integer} cols Number of columns
 * @param {Integer} cellWidth Cell width (in pixels)
 * @param {string} color A valid CSS color. Defaults to 'black'
 */
GOL.World = function(rows, cols, cellWidth, cellColor) {
  this.rows = rows;
  this.cols = cols;
  this.cellWidth = cellWidth;
  this.cellColor = (typeof(cellColor) === 'undefined') ? 'black' : cellColor;
  this.age = 0;
  this.cells = null;
}

/**
 * Initialize the world
 *
 * TODO `map` argument for initializing the world (default to "random")
 *
 * @method init
 */
GOL.World.prototype.init = function() {
  // random cell status
  this.cells = new Array(this.rows);
  for (var i = 0; i < this.rows; i++) {
    this.cells[i] = new Array(this.cols);

    for (var j = 0; j < this.cols; j++) {
      var cellStatus = Boolean(Math.floor(Math.random() * 2));

      if (cellStatus) {
        this.cells[i][j] = new GOL.Cell(
            this.cellWidth * j,
            this.cellWidth * i,
            this.cellWidth,
            this.cellColor
        );
      } else {
        this.cells[i][j] = null;
      }
    }
  }
}

/**
 * Get cell neighbours.
 *
 * @method getCellNeighbours
 * @param {Integer} row Cell row number
 * @param {Integer} col Cell column number
 * @return {Array} Array of neighbours
 */
GOL.World.prototype.getCellNeighbours = function(row, col) {
  var neighbours = new Array(8);
  var index = 0;

  for (var i= row - 1; i <= row + 1; i++) {
    for (var j= col -1; j <= col + 1; j++) {
      if (i == row && j == col) continue;
      neighbours[index] = this.cells[GOL.modulus(i, this.rows)][GOL.modulus(j, this.cols)];
      index++;
    }
  }
  return neighbours;
}

/**
 * Update the world
 *
 * 23/3 implementation:
 * - Any live cell with fewer than two live neighbours dies. 
 * - Any live cell with more than three live neighbours dies. 
 * - Any live cell with two or three live neighbours lives (unchanged).
 * - Any dead cell with exactly three live neighbours comes to life.
 *
 * @method update
 */
GOL.World.prototype.update = function() {
  var newCells = this.cloneCells();

  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      var count = this.getCellNeighbours(i, j).filter(function(element) {
        return element != null;
      }).length

      if (this.cells[i][j]) {
        if (count == 2 || count == 3) {
          newCells[i][j].age++;
        } else {
          newCells[i][j] = null;
        }
      } else if (count == 3) { // new cell is born
        newCells[i][j] = new GOL.Cell(
            this.cellWidth * j,
            this.cellWidth * i,
            this.cellWidth,
            this.cellColor
        );
      }
    }
  }
  this.cells = newCells;
  this.age++;
}

/**
 * Draw the world.
 *
 * @method draw
 * @param {object} context The html5 canvas context
 */
GOL.World.prototype.draw = function(context) {
  GOL.validateContext(context);

  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      if (this.cells[i][j]) this.cells[i][j].draw(context);
    }
  }
}

/**
 * Clear the world drawing.
 *
 * @method clear
 * @param {object} context The html5 canvas context
 */
GOL.World.prototype.clear = function(context) {
  GOL.validateContext(context);
  // FIXME way too hackish
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

/**
 * Clone cells.
 *
 * TODO this method is not needed if using memory optimization
 *
 * @method cloneCells
 * @return {Array} 2d array of cloned cells
 */
GOL.World.prototype.cloneCells = function() {
  var clonedCells = new Array(this.rows);

  for (var i = 0; i < this.rows; i++) {
    clonedCells[i] = new Array(this.cols);
    for (var j = 0; j < this.cols; j++) {
      clonedCells[i][j] = (this.cells[i][j]) ? this.cells[i][j] : null;
    }
  }
  return clonedCells;
}

/**
 * To string.
 *
 * @method toString
 * @return {String} String representation of the world.
 */
GOL.World.prototype.toString = function() {
  return 'world aged ' + this.age; //FIXME
}

/**
 * A world cell.
 *
 * @class Cell
 * @constructor
 * @param {integer} x coordinate
 * @param {integer} y coordinate
 * @param {integer} width
 * @param {string} color A valid CSS color. Defaults to 'black'
 */
GOL.Cell = function(x, y, width, color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.color = (typeof(color) === 'undefined') ? 'black' : color;
  this.age = 0;
};

/**
 * Draw the cell.
 *
 * @method draw
 * @param {object} the html5 canvas context to draw into
 */
GOL.Cell.prototype.draw = function(context) {
  GOL.validateContext(context);
  context.fillStyle = this.color;
  context.fillRect(this.x, this.y, this.width, this.width);
}

/**
 * Clear the cell drawing.
 *
 * @method clear
 * @param {object} context The html5 canvas context
 */
GOL.Cell.prototype.clear = function(context) {
  GOL.validateContext(context);
  context.clearRect(this.x, this.y, this.width, this.width);
}

/**
 * @method clone
 * @return {Cell} Cloned cell
 */
GOL.Cell.prototype.clone = function() {
  var clonedCell = new GOL.Cell(this.x, this.y, this.width, this.color);
  clonedCell.age = this.age;
  return clonedCell;
}

/**
 * Positive modulus
 *
 * @param {Integer} x
 * @param {Integer} y
 * @return {Integer} the positive modulus for x and y
 */
GOL.modulus = function(x, y) {
  var result = x % y;
  return (result < 0) ? result + y : result;
}

/**
 * Validate canvas
 *
 * @method validateCanvas
 * @param {Object} canvas A canvas
 * @return {Boolean} True for a valid canvas. `TypeError` exception if invalid.
 */
GOL.validateCanvas = function(canvas) {
  if (!canvas || !canvas.getContext) {
    throw new TypeError("Invalid canvas")
  }
  return true;
}

/**
 * Validate context
 *
 * @method validateContext
 * @param {Object} context A canvas context
 * @return {Boolean} True for a valid context. `TypeError` exception if invalid.
 */
GOL.validateContext = function(context) {
  if (!context || !context.fillRect) {
    throw new TypeError("Invalid context")
  }
  return true;
}
