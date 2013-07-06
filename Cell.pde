/**
 * Just a cell.
 *
 */
public class Cell {

    protected int age = 0;

    protected boolean status;

    protected int width;

    /** Cell x position */
    protected int x;

    /** Cell y position */
    protected int y;

    /**
     * Class constructor.
     */
    public Cell (int x, int y, int width, boolean status) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.status = status;
    }

    /**
     * Get x position.
     */
    public int getX() {
        return x;
    }

    /**
     * Get y position.
     */
    public int getY() {
        return y;
    }

    /**
     * Is alive.
     */
    public boolean isAlive() {
        return status;
    }

    /**
     * Kill it.
     */
    public void kill() {
        if (status) {
            status = false;
            age = 0;
        }
    }

    /**
     * Get it back from the dead!
     */
    public void revive() {
        if (!status) {
            status = true;
            age = 0;
        }
    }

    /**
     * Get age.
     */
    public int getAge() {
        return age;
    }

    /**
     * Increments age.
     */
    public void grow() {
        if (status) {
            age++;
        }
    }

    /**
     * Clone cell.
     */
    public Cell clone() {
        Cell newCell = new Cell(x, y, width, status);
        newCell.age = this.age;
        newCell.color = this.color;

        return newCell;
    }

    /**
     * Get color.
     *
     * TODO test with range 200 - 40, changing factor.
     */
    public int getColor() {
        // color = maxColor - (factor * age)
        int color = 160 - (45 * this.age);
        if (color < 40) {
          return 40;
        } else {
          return color;
        }
    }

    /**
     * Draw cell.
     */
    public void draw() {
        noStroke();

        if (status) {
            fill(this.getColor());
        } else {
            noFill();
        }
        rect(x, y, width, width);
    }
}
