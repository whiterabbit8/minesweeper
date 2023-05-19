class Minesweeper {
  constructor(width, height, mines) {
    this.width = width;
    this.height = height;
    this.mines = mines;
    this.matrix = this.createMatrix(width, height, mines);
    this.field = this.createField();
  }

  createMatrix(x, y, mines) {
    let matrix = [];
    const arr0 = new Array(x * y - mines).fill(0);
    const arr1 = new Array(mines).fill(9);
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
    console.log(field);
    return field;
  }

  showField() {
    const field = document.createElement('div');
    field.className = 'field';
    document.querySelector('.game-wrapper').append(field);
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell closed';
        cell.id = `cell_${i}_${j}`
        cell.setAttribute('y', `${i}`);
        cell.setAttribute('x', `${j}`);
        field.append(cell);
      }
    }
  }

  resetField() {
    document.querySelector('.start-button').className = 'start-button';
    this.matrix = this.createMatrix(this.width, this.height, this.mines);
    this.field = this.createField();
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.className = 'cell closed';
    });
  }

  openCell(event) {
    const targetCell = event.target.closest('.closed');
    if (targetCell) {
      console.log(targetCell);
      let x = Number(targetCell.getAttribute('x'));
      let y = Number(targetCell.getAttribute('y'));
      targetCell.classList.remove('closed');

      if (this.field[y][x] === 9) {
        this.showExplosion();
        targetCell.classList.add('mine-red');
      } else if (this.field[y][x] === 0) {
        this.matrix[y].splice(x, 1, 1);
        targetCell.classList.add('type0');
        openNeighbourCell(y, x, this.field, this.matrix);
        const cells = document.querySelectorAll('.cell');
        for (let i = 0; i < cells.length; i++) {
          let x = Number(cells[i].getAttribute('x'));
          let y = Number(cells[i].getAttribute('y'));
          if (this.matrix[y][x] === 1) {
            cells[i].classList.remove('closed');
            cells[i].classList.remove('flag');
            cells[i].classList.add(`type${this.field[y][x]}`);
          }
        }
      } else {
        this.matrix[y].splice(x, 1, 1);
        targetCell.classList.add(`type${this.field[y][x]}`);
      }
    }

    function openNeighbourCell(y, x, field, matrix) {
      if (field[y - 1] && (!matrix[y - 1][x] || matrix[y - 1][x] === 'wf')) {
        matrix[y - 1].splice(x, 1, 1);
        if (!field[y - 1][x]) {
          openNeighbourCell(y - 1, x, field, matrix);
        }
      }
      if (field[y][x + 1] !== undefined && (!matrix[y][x + 1] || matrix[y][x + 1] === 'wf')) {
        matrix[y].splice(x + 1, 1, 1);
        if (!field[y][x + 1]) {
          openNeighbourCell(y, x + 1, field, matrix);
        }
      }
      if (field[y][x - 1] !== undefined && (!matrix[y][x - 1] || matrix[y][x - 1] === 'wf')) {
        matrix[y].splice(x - 1, 1, 1);
        if (!field[y][x - 1]) {
          openNeighbourCell(y, x - 1, field, matrix);
        }
      }
      if (field[y + 1] && (!matrix[y + 1][x] || matrix[y + 1][x] === 'wf')) {
        matrix[y + 1].splice(x, 1, 1);
        if (!field[y + 1][x]) {
          openNeighbourCell(y + 1, x, field, matrix);
        }
      }
    }
    this.checkWin();
  }

  setFlag(event) {
    const targetCell = event.target.closest('.closed');
    if (targetCell) {
      const x = Number(targetCell.getAttribute('x'));
      const y = Number(targetCell.getAttribute('y'));
      if (!targetCell.classList.contains('flag')) {
        if (this.field[y][x] === 9) {
          this.matrix[y].splice(x, 1, 'f');
        } else {
          this.matrix[y].splice(x, 1, 'wf');
        }
      } else {
        if (this.field[y][x] === 9) {
          this.matrix[y].splice(x, 1, 9);
        } else {
          this.matrix[y].splice(x, 1, 0);
        }
      }
      targetCell.classList.toggle('flag');
    }
  }

  showExplosion() {
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
      let x = Number(cells[i].getAttribute('x'));
      let y = Number(cells[i].getAttribute('y'));
      if (this.matrix[y][x] === 9) {
        cells[i].classList.add('mine');
      } else if (this.matrix[y][x] === 'wf') {
        cells[i].classList.add('mine-wrong');
      }
    }
    this.changeStatus('lose');
  }

  changeStatus(gameEvent) {
    const status = document.querySelector('.start-button');
    const closedCells = document.querySelectorAll('.closed');
    switch(gameEvent) {
      case 'win':
        status.classList.add('win');
        closedCells.classList.add('flag');
        break;
      case 'lose':
        status.classList.add('lose');
        break;
    }
  }

  checkWin(matrix = this.matrix) {
    let sum = 0;
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (matrix[i][j] === 1) {
          sum += 1;
        }
      }
    }
    if (sum === this.width * this.height - this.mines) {
      this.changeStatus('win');
    }
  }
}

export default Minesweeper;
