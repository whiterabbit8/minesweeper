class Minesweeper {
  constructor(width, height, mines) {
    this.width = width;
    this.height = height;
    this.mines = mines;
    this.matrix = this.createMatrix(width, height, mines);
  }

  createMatrix(x, y, mines) {
    let matrix = [];
    let arr0 = new Array(x * y - mines).fill(0);
    let arr1 = new Array(mines).fill(9);
    let arr = arr0.concat(arr1);
    let shuffledArr = arr.sort(() => Math.random() - 0.5);
    for (let i = 0; i < y; i++) {
      matrix.push(shuffledArr.slice(i * x, i * x + x))
    }
    return matrix;
  }

  createField(matrix = this.matrix) {
    let field = [];
    for (let i = 0; i < matrix.length; i++) {
      let line = [];
      for (let j = 0; j < matrix[i].length; j++) {
        let counter = 0;
        if (!matrix[i][j]) {
          if (matrix[i - 1] && matrix[i - 1][j - 1] == 9) counter++;
          if (matrix[i - 1] && matrix[i - 1][j] == 9) counter++;
          if (matrix[i - 1] && matrix[i - 1][j + 1] == 9) counter++;
          if (matrix[i][j - 1] == 9) counter++;
          if (matrix[i][j + 1] == 9) counter++;
          if (matrix[i + 1] && matrix[i + 1][j - 1] == 9) counter++;
          if (matrix[i + 1] && matrix[i + 1][j] == 9) counter++;
          if (matrix[i + 1] && matrix[i + 1][j + 1] == 9) counter++;
          line.push(counter);
        } else {
          line.push(matrix[i][j]);
        }
      }
      field.push(line);
    }
    return field;
  }
}
