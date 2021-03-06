// NOTE: shared.js, coordinate.js must be included in html before this file for this class to work
'use strict';

/**
 * ShipsGenerator class.
 *
 * @constructor
 * @param {Array} - 2D grid of the current user
 */
function ShipsGenerator(grid) {
    // define the grid columns and rows
    this.gridCols = Setup.GRID_DIM.cols;
    this.gridRows = Setup.GRID_DIM.rows;

    // check grid for validity
    this.consoleAssertGrid(grid);

    // create the ships array
    this.ships = [];

    // assign the grid to this shipGenerator object
    this.grid = grid;

    // add all the available ships to the ships array
    this.ships.push(Setup.DESTROYER);
    this.ships.push(Setup.SUBMARINE);
    this.ships.push(Setup.CRUISER);
    this.ships.push(Setup.BATTLESHIP);
    this.ships.push(Setup.CARRIER);
}

/**
 * Get random int between 0 and max.
 * OR 0 or 1 if direction is set to true.
 * NOTE: this method is not needed anymore and is deprecated
 * @deprecated
 * @param {Number} - The max number that Math.random is allowed to generate.
 * @param {Boolean} - if true, use Math.random for geenerating 0 or 1. Otherwise use normal implementation.
 */
ShipsGenerator.prototype.getRandomInt = function(max, randomDirection) {
    if (randomDirection) {
        // generates 0 OR 1 randomly
        return Math.floor(Math.random() * 2);
    } else {
        return Math.floor(Math.random() * Math.floor(max));
    }
}

/**
 * Places each ship in random location on the board/grid.
 * 
 */
ShipsGenerator.prototype.placeShipsRandomly = function() {

    // go through all ships and place them on the grid on random locations
    for (let s = 0; s < this.ships.length; s++) {
        var currShip = this.ships[s];

        // shipID to be assigned on the grid to indicate where current ship is placed on the grid
        var shipID = currShip.id;

        // find location coordinates of current ship that do not overlap with other ships already on the grid
        var currShipLocations;
        do {
            currShipLocations = this.generateShipLocations(currShip);
        } while(this.isOverlapping(currShipLocations) || this.hasAdjecentShips(currShip));

        // assign grid location on the grid with proper id of the current ship
        var c, currShipCoordinate;
        for (c = 0; c < currShipLocations.length; c++) {
            currShipCoordinate = currShipLocations[c];
            this.grid[currShipCoordinate.getX()][currShipCoordinate.getY()] = shipID;
        }
    }
    
}


/**
 * Generate array of random ship location Coordinates given a ship.
 * 
 * @param {Object} - Ship Object.
 * @returns - Array of Coordinate objects of randomly generated ship locations.
 */
ShipsGenerator.prototype.generateShipLocations = function(ship) {
    var shipSize = ship.size;

    // generate 0 OR 1 to place given ship vertically or horizontally
    var direction = Math.floor(Math.random() * 2);
    
    var rowCoord, colCoord;

    // get startCoord and endCoord depending on direction
    if (direction === Setup.HORIZONTAL_DIRECTION) {
        rowCoord = Math.floor(Math.random() * this.gridRows);
        colCoord =  Math.floor(Math.random() * (this.gridCols - shipSize + 1));
    } else {
        rowCoord = Math.floor(Math.random() * (this.gridRows - shipSize + 1));
        colCoord =  Math.floor(Math.random() * this.gridCols);
    }

    // store start tile x-coordinate and y-coordinate in the ship object.
    // store whether ships is placed horizontally or vertically in ship object. 
    direction === Setup.HORIZONTAL_DIRECTION ? ship.horizontal = true : ship.horizontal = false;
    ship.x = rowCoord;
    ship.y = colCoord;

    var currShipRandomLocations = [];
    for (let i = 0; i < shipSize; i++) {
        if (direction === Setup.HORIZONTAL_DIRECTION) {
            currShipRandomLocations.push(new Coordinate(rowCoord, colCoord + i));
        } else {
            currShipRandomLocations.push(new Coordinate(rowCoord + i, colCoord));
        }
    }

    return currShipRandomLocations;
}


/**
 * Given a ship location array, check whether there are any collision with other ships already on the grid.
 * e.g. Destroyer ship random locations = [Coordinate(5,6), Coordinate(5,5)]
 * 
 * @param {Array} - An array of Coordinate object to indicate the position of each part of given ship.
 * @returns - true if there are collisions, else false.
 */
ShipsGenerator.prototype.isOverlapping = function(shipLocations) {
    // shipLocations must NOT be empty
    console.assert(
        shipLocations.length !== 0,
        "Ship location array must not be empty."
    );
    
    var loc, currCoordinate;
    for (loc = 0; loc < shipLocations.length; loc++) {
        currCoordinate = shipLocations[loc];
        if (this.grid[currCoordinate.getX()][currCoordinate.getY()] > 0) {
            return true;
        }
    }

    // if loop terminated without returning true means that there were no collisions
    return false;
}

/**
 * @description Checks whether there are any adjecent ships near a given ship.
 * @param {Object} ship - The ship of which to check whether there are any other adjecent ships next it
 * @returns true if there are adjecent ships are found, otherwise false. 
 */
ShipsGenerator.prototype.hasAdjecentShips = function (ship) {
    var currShipIsHorizontal = ship.horizontal;
    var r1 = ship.x - 1; 
    var c1 = ship.y - 1;
    var r2 = currShipIsHorizontal ? ship.x + 1 : ship.x + ship.size;
    var c2 = currShipIsHorizontal ? ship.y + ship.size : ship.y + 1;

    var c, r;
    for(c = c1; c <= c2; c++) {
        if(c < 0 || c > this.gridCols - 1) continue;
        for(r = r1; r <= r2; r++) {
            if(r < 0 || r > this.gridRows - 1) continue;
            if(this.grid[r][c] > 0) {
                return true;
            }
        }
    }
    
    return false;
}

/**
 * Given a new grid, place ships randomly. 
 * @param {Array} grid - new 2D grid of zeros to re-randomize the ships on   
 */
ShipsGenerator.prototype.rerandomizeShips = function(grid) {
    this.consoleAssertGrid(grid);
    this.grid = grid;
    this.placeShipsRandomly();
}

/**
 * Check whether given grid is a valid grid with expected dimensions and initial values on each entry
 * @param {Array} grid - grid to check 
 */
ShipsGenerator.prototype.consoleAssertGrid = function(grid) {
    // check if grid has expected amount of rows
    console.assert(
        grid.length == this.gridRows,
        "Got grid rows of %d, but should be %d ", grid.length, this.gridRows
    );

    // check if grid has expected amount of columns on each row
    console.assert(
        grid.every(function(row) {
            return row.length == Setup.GRID_DIM.cols;
        }),
        "Not all grid columns are %d ", this.gridCols
    );

    // Grid must be square
    console.assert(
        this.gridRows == this.gridCols,
        "Grid must be square, but got %d rows and %d columns", this.gridRows, this.gridCols
    );

    // grid must consist of 0 in all entries
    console.assert(
        grid.every(function(row) {
            return row.every(function(val) {
                return val === 0;
            })
        }),
        "Grid does not contain all 0's"
    );
}