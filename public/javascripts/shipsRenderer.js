'use strict';

/**
 * ShipsRenderer class.
 *
 * @constructor
 */
function ShipsRenderer() {
    // assign class of the tiles where the ships can be placed of the current player. (self)
    this.selfTileClass = 'td.battlefield_cell_self_tile';

    // assign class of the tiles of the opponent that the current player can shoot on. (rival)  
    this.opponentTileClass = 'td.battlefield_cell_rival_tile';

    // assign id of self hits
    this.hitsSelfId = '#hitsself';

    // assign id of rival hits
    this.hitsOpponentId = '#hitsrival';

    // the color to render when a ship is hit on a tile
    this.colorHit = Setup.COLOR_HIT;

    // the color to render when no ship is hit (when current player misses)
    this.colorMiss = Setup.COLOR_MISS;

    // mapping ship_id of all ships to their respective color
    this.ships = {
        1: Setup.DESTROYER.color,
        2: Setup.SUBMARINE.color,
        3: Setup.CRUISER.color,
        4: Setup.BATTLESHIP.color,
        5: Setup.CARRIER.color
    };
}

/**
 * Render all ships on the given grid of the current player.
 * @param {Array} grid - 2D grid to draw the ships on
 */
ShipsRenderer.prototype.renderSelfGrid = function (grid) {
    var r, c;
    for (r = 0; r < grid.length; r++) {
        for (c = 0; c < grid[r].length; c++) {
            var currTileId = grid[r][c];
            if (currTileId > 0) {
                var currShipColor = this.ships[currTileId]
                var tileToColor = $(this.selfTileClass + "[data-x='" + c + "'][data-y='" + r + "']")

                // color the tile corresponding to the ship id with corresponding color
                tileToColor.css("background-color", currShipColor)
            }
        }
    }
}

/**
 * @description - Removes style attributes from all <td> tags of the self grid. 
 */
ShipsRenderer.prototype.resetSelfTilesRendering = function () {
    $(this.selfTileClass).removeAttr('style');
}

/**
 * @description - Renders the color on the tile where a ship is hit either on opponent or current player grid.
 * @param {Number} x - x-coordinate of the tile that was hit by current player
 * @param {Number} y - y-coordinate of the tile that was hit by current player
 * @param {Boolean} isOpponent - Indicates whether to render the hit color on opponent grid or on current player grid 
 */
ShipsRenderer.prototype.renderTileHit = function (x, y, isOpponent) {
    var tileHit;
    var borderStyle = "2px solid black";

    if (isOpponent) {
        tileHit = $(this.opponentTileClass + "[data-x='" + y + "'][data-y='" + x + "']");
    } else {
        tileHit = $(this.selfTileClass + "[data-x='" + y + "'][data-y='" + x + "']"); 
    }

    tileHit.css({ "background-color": this.colorHit, "border": borderStyle });
}

/**
 * @description - Renders the color on the tile where no ship is hit either on opponent or current player grid.
 * @param {Number} x - x-coordinate of the tile that was missed by current player
 * @param {Number} y - y-coordinate of the tile that was missed by current player
 * @param {Boolean} isOpponent - Indicates whether to render the "miss" color on opponent grid or on current player grid 
 */
ShipsRenderer.prototype.renderTileMiss = function (x, y, isOpponent) {
    var tileMiss;
    var borderStyle = "2px solid black";

    if (isOpponent) {
        tileMiss = $(this.opponentTileClass + "[data-x='" + y + "'][data-y='" + x + "']");
    } else {
        tileMiss = $(this.selfTileClass + "[data-x='" + y + "'][data-y='" + x + "']"); 
    }

    tileMiss.css({ "background-color": this.colorMiss , "border": borderStyle });
}

/**
 * Render the updated hits number of current player.
 * @param {Number} hits - the updated hits. 
 */
ShipsRenderer.prototype.updateHitsSelf = function (hits) {
    $(this.hitsSelfId).html(hits.toString());
}

/**
 * Render the updated hits number of opponent.
 * @param {Number} hits - the updated hits. 
 */
ShipsRenderer.prototype.updateHitsOpponent = function (hits) {
    $(this.hitsOpponentId).html(hits.toString());
}