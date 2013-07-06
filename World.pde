/**
 * Class World.
 *
 * Fast and dirty implementation of Conway's Game Of Life (23/3).
 *
 * Toroidal array approach: The active areas that move across a field edge
 * reappear at the opposite edge.
 *  
 *  15  | 12 13 14 15 | 12
 *  ----------------------
 *   3  |  0  1  2  3 |  0
 *  11  |  8  9 10 11 |  8
 *  15  | 12 13 14 15 | 12
 *  ----------------------
 *   3  |  0  1  2  3 |  0
 *
 */

public class World {

    private static final int CELL_WIDTH = 30;

    protected Cell[][] cells;

    protected final int rows;

    protected final int cols;

    /**
     * Class constructor.
     */
    public World(int cols, int rows) {
        this.cols = cols;
        this.rows = rows;

        cells = new Cell[cols][rows];

        this.initCells();
    }

    /**
     * Init cells.
     */
    protected void initCells() {
        for (int i= 0; i< cols; i++) {
            for (int j= 0; j < rows; j++) {
                state = random(1) < 0.5; // bias
                cells[i][j] = new Cell(
                    CELL_WIDTH*i,
                    CELL_WIDTH*j,
                    CELL_WIDTH,
                    state
                );
            }
        }
    }

    /**
     * Get cell.
     */
    public Cell getCell(int col, int row) {
        if (row < rows && col < cols) {
            return this.cells[col][row];
        } else {
            throw new Error("Wrong location: " + col + "," + row);
        }
    }

    /**
     * Get cell neighbours.
     *
     * TODO validate position
     *
     * @return list of neighbours for the cell.
     */
    public Cell[] getCellNeighbours(int col, int row) {
        neighbours = new Cell[8];
        int index = 0;

        for (int i= col -1; i <= col +1; i++) {
            for (int j= row -1; j <= row +1; j++) {
                if (i == col && j == row) {
                    continue;
                }
                neighbours[index] = cells[modulus(i, cols)][modulus(j, rows)];
                index++;
            }
        }
        return neighbours;
    }

    /**
     * Count alive cell neighbours.
     */
    public int countAliveNeighbours(int col, int row) {
        int count = 0;
        neighbours = this.getCellNeighbours(col, row);

        for (int i= 0; i < neighbours.length; i++) {
            if (neighbours[i].isAlive()) {
                count++;
            }
        }
        return count;
    }

    /**
     * Clone cells.
     *
     * Current processing.js arrayCopy() is unable to copy 2 dimensional arrays.
     */
    private Cell[][] cloneCells() {
        Cell[][] dest = new Cell[cols][rows];

        for (int i= 0; i < cols; i++) {
            for (int j= 0; j < rows; j++) {
                dest[i][j] = this.cells[i][j].clone();
            }
        }
        return dest;
    }

    /**
     * Update world.
     *
     * TODO should be optimized...
     *
     * 23/3 implementation:
     * - Any live cell with fewer than two live neighbours dies. 
     * - Any live cell with more than three live neighbours dies. 
     * - Any live cell with two or three live neighbours lives (unchanged).
     * - Any dead cell with exactly three live neighbours comes to life.
     */
    public void update() {
        Cell[][] newCells = this.cloneCells();

        for (int i= 0; i < cols; i++) {
            for (int j= 0; j < rows; j++) {
                int n = this.countAliveNeighbours(i,j);

                if (cells[i][j].isAlive()) {
                    if (n == 2 || n == 3) {
                        newCells[i][j].grow();
                    } else {
                        newCells[i][j].kill();
                    }
                } else if (n == 3) {
                    newCells[i][j].revive();
                }
            }
        }

        this.cells = newCells;
    }

    /**
     * Draw world.
     */
    public void draw() {
        for (int i= 0; i< cols; i++) {
            for (int j= 0; j < rows; j++) {
                cells[i][j].draw();
            }
        }
    }
}

/**
 * Positive modulus.
 */
int modulus(int x, int y) {
    int result = x % y;

    if (result < 0 ) {
        result += y;
    }
    return result;
}
