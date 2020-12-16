import {dragStart, dragOver, dragEnter} from './DragEvents.js';
import createDomNode from './CreateDomNode.js';

export default class Field {
  constructor(level = 4, audio = true, width = 400, picture = true) {
    this.level = level;
    this.audio = audio;
    this.picture = picture;
    this.cellsAmount = level * level - 1;
    this.width = width;
    this.cellSize = this.width / level;
    this.cells = [];
    this.moves = 0;
    this.empty = {};
    this.timer = 0;
    this.finishGame = false;
    this.image = Math.floor(Math.random() * 150) + 1;
  }

  init() {
    this.field = createDomNode(this.field, 'div', null, 'field');
    this.createCells();
    this.init2(this.field);
    return this.field;
  }

  // начать сохраненную игру
  initSavedGame() {
    this.field = createDomNode(this.field, 'div', null, 'field');
    this.createCellsSavedField();
    this.init2(this.field);
    return this.field;
  }

  // общая функция для начала новой ил сохраненной игры
  init2(field) {
    this.audioDiv = document.createElement('audio');
    this.audioDiv.src = '../src/audio/sound.mp3';
    this.overlay = createDomNode(this.overlay, 'div', null, 'overlay', 'hidden');
    this.overlay.innerHTML = `<span class="message"> game paused, want to save it? <button class= 'save-game'> save game</button></span>
      <div class="overlay-main">
      <button class="new-game">New Game</button>
      <button class="continue-game">Continue</button>
      </div>
    `;
    this.overlayWin = createDomNode(this.overlay, 'div', null, 'overlayWin', 'hidden');
    this.overlayWin.innerHTML = "<p>YOU WON!</p><p class='phrase'>Yo solve the puzzle for </p> <button class='new-game'>New Game</button>";
    this.overlayResults = createDomNode(this.overlay, 'div', null, 'overlayResults', 'hidden');
    this.overlayResults.innerHTML = "<div class='score'></div><button class='hide-results'>Hide results</button>";
    field.append(this.audioDiv, this.overlay, this.overlayWin, this.overlayResults);
  }

  createCellsArray() { // замешиваем числа и проверяем решаемость пазла
    let numbers = [...Array(this.cellsAmount).keys()]
      .sort(() => Math.random() - 0.5);
    // проверить решаемость
    let sum = 0;
    for (let i = 0; i < numbers.length; i += 1) {
      for (let j = i; j < numbers.length; j += 1) {
        if (numbers[i] > numbers[j]) {
          sum += 1;
        }
      }
    }
    if (this.level === 4 || this.level === 6 || this.level === 8) {
      sum += this.level; // добавить для четных уровней номер ряда пустой ячейки
    }
    if (sum % 2 !== 0) {
      numbers = this.createCellsArray();
      return numbers;
    }
    return numbers;
  }

  // создаем для замешанных чисел дивы, вешаем обработчики, устанавливаем стили
  createCells() {
    const numbersArr = this.createCellsArray();
    this.empty.value = this.level * this.level;
    this.empty.top = this.level - 1;
    this.empty.left = this.level - 1;
    this.cells.push(this.empty);
    const emptyCell = document.createElement('div');
    emptyCell.className = 'cell';
    emptyCell.classList.add('empty-cell');
    emptyCell.style.width = `${this.width / this.level - 2}px`;
    emptyCell.style.height = emptyCell.style.width;
    emptyCell.ondragenter = 'dragEnter(event)';
    emptyCell.ondrop = 'dragDrop(event)';
    emptyCell.ondragover = 'dragOver(event)';
    emptyCell.style.left = `${this.empty.left * this.cellSize}px`;
    emptyCell.style.top = `${this.empty.top * this.cellSize}px`;
    this.field.append(emptyCell);
    emptyCell.addEventListener('dragenter', (e) => {
      dragEnter(e);
    });
    emptyCell.addEventListener('drop', (e) => {
      this.dragDrop(e);
    });
    emptyCell.addEventListener('dragover', (e) => {
      dragOver(e);
    });
    this.empty.element = emptyCell;
    for (let i = 1; i <= this.cellsAmount; i++) {
      const cell = document.createElement('div');
      cell.draggable = 'true';
      const value = numbersArr[i - 1] + 1;
      cell.className = 'cell';
      cell.style.width = `${this.width / this.level - 2}px`;
      cell.style.height = cell.style.width;
      cell.innerHTML = value;

      const left = (i - 1) % this.level;
      const top = (i - left - 1) / this.level;

      this.cells.push({
        value,
        left,
        top,
        element: cell,
      });

      cell.style.left = `${left * this.cellSize}px`;
      cell.style.top = `${top * this.cellSize}px`;

      this.field.append(cell);

      cell.addEventListener('click', () => {
        this.move(i);
      });

      cell.addEventListener('dragstart', (e) => {
        dragStart(e);
      });

      const leftVal = (value - 1) % this.level;
      const topVal = (value - leftVal - 1) / this.level;
      if (this.picture) {
        cell.style.backgroundSize = `${this.width}px ${this.width}px`;
        cell.style.backgroundImage = `url(./src/images/${this.image}.jpg)`;
        const width = this.width / this.level - 2;
        cell.style.backgroundPosition = `-${leftVal * width}px -${topVal * width}px`;
      }
    }
  }

  // создаем для сохраненной игры дивы, вешаем обработчики, устанавливаем стили
  createCellsSavedField() {
    this.cellSize = this.width / this.level;
    const emptyCell = document.createElement('div');
    emptyCell.className = 'cell';
    emptyCell.classList.add('empty-cell');
    emptyCell.style.width = `${this.width / this.level - 2}px`;
    emptyCell.style.height = emptyCell.style.width;
    emptyCell.style.left = `${this.empty.left * this.cellSize}px`;
    emptyCell.style.top = `${this.empty.top * this.cellSize}px`;
    emptyCell.ondragenter = 'dragEnter(event)';
    emptyCell.ondrop = 'dragDrop(event)';
    emptyCell.ondragover = 'dragOver(event)';
    this.field.append(emptyCell);
    emptyCell.addEventListener('dragenter', (e) => {
      dragEnter(e);
    });
    emptyCell.addEventListener('drop', (e) => {
      this.dragDrop(e);
    });
    emptyCell.addEventListener('dragover', (e) => {
      dragOver(e);
    });
    this.empty.element = emptyCell;

    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].value === this.level * this.level) {
        this.cells[i] = this.empty;
        continue;
      }
      const cell = document.createElement('div');
      cell.draggable = 'true';
      cell.className = 'cell';
      cell.style.width = `${this.width / this.level - 2}px`;
      cell.style.height = cell.style.width;
      cell.innerHTML = this.cells[i].value;

      cell.style.left = `${this.cells[i].left * this.cellSize}px`;
      cell.style.top = `${this.cells[i].top * this.cellSize}px`;
      this.cells[i].element = cell;

      this.field.append(cell);

      cell.addEventListener('click', () => {
        this.move(i);
      });
      cell.addEventListener('dragstart', (e) => {
        dragStart(e);
      });

      if (this.picture) {
        const leftVal = (this.cells[i].value - 1) % this.level;
        const topVal = (this.cells[i].value - leftVal - 1) / this.level;
        cell.style.backgroundSize = `${this.width}px ${this.width}px`;
        cell.style.backgroundImage = `url(../src/images/${this.image}.jpg)`;
        const width = this.width / this.level - 2;
        cell.style.backgroundPosition = `-${leftVal * width}px -${topVal * width}px`;
      }
    }
  }

  // начало движения по клику
  move(index) {
    const cell = this.cells[index];
    this.moveAndDrag(cell);
  }

  // логика движения клетки по клику и драгу
  moveAndDrag(cell, e) {
    const leftDiff = Math.abs(this.empty.left - cell.left);
    const topDiff = Math.abs(this.empty.top - cell.top);

    if (leftDiff + topDiff > 1) {
      return; // если клетка не соседняя, движения не происходит
    }
    if (e === 'drop') {
      cell.element.style.transition = 'none';
      setTimeout(() => {
        cell.element.style.transition = 'all 0.3s';
      }, 500);
    }
    cell.element.style.left = `${this.empty.left * this.cellSize}px`;
    cell.element.style.top = `${this.empty.top * this.cellSize}px`;
    const emptyLeft = this.empty.left;
    const emptyTop = this.empty.top;
    this.empty.left = cell.left;
    this.empty.top = cell.top;
    cell.left = emptyLeft;
    cell.top = emptyTop;
    this.empty.element.style.left = `${this.empty.left * this.cellSize}px`;
    this.empty.element.style.top = `${this.empty.top * this.cellSize}px`;
    this.playAudio();
    this.moves += 1;
    const isFinished = this.cells.every(cell => {
      return (cell.value - 1) === cell.top * this.level + cell.left;
    });

    if (isFinished) {
      this.saveResultToLocalStorage();
      this.finishGame = true;
      let innerText = new Date(this.timer * 1000).toUTCString().split(/ /)[4];
      if (innerText[0] === 0 && innerText[1] === 0) {
        innerText = innerText.slice(3);
      }
      document.querySelector('.phrase').innerHTML = `You solve the puzzle for<br> ${innerText} time and ${this.moves} moves`;
      this.timer = 0,
      this.overlayWin.classList.remove('hidden');
    }
  }

  dragDrop(e) {
    const data = e.dataTransfer.getData('Text');
    const cell = this.cells.find((cell) => cell.value == data);
    this.moveAndDrag(cell, 'drop');
  }

  saveResultToLocalStorage() {
    if (localStorage.getItem('results')) {
      let results = JSON.parse(localStorage.getItem('results'));
      results.push([this.level, this.moves, this.timer]);
      results.sort((a, b) => (a[2] > b[2] ? 1 : -1)); // сортируем результаты по времени
      if (results.length > 10) results = results.slice(0, 10);
      localStorage.setItem('results', JSON.stringify(results));
    } else {
      const results = [];
      results.push([this.level, this.moves, this.timer]);
      localStorage.setItem('results', JSON.stringify(results));
    }
  }

  playAudio() {
    if (!this.audio) return;
    const audio = document.querySelector('audio');
    audio.currentTime = 0;
    audio.play();
  }
}