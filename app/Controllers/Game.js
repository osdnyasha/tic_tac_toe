define('app/Controllers/Game.js', [
    'app/Components/Component.js',
    'app/Components/Board.js',
    'app/Components/AiPlayer.js'
], function (Component,Board,AiPlayer) {

    return class Game extends Component {
        /**
         * Инициализация компонента
         */
        constructor() {
            super();
            this.board = null; //массив заполненых ячеек
            this.reset = this.reset.bind(this); 
            this.gameEnd = false; // Завершена ли игра
            this.currentPlayer = ['o','x']; // массив игроков
            this.currentSymbol = 1; // текущий символ(ход игры) в массиве игроков
            this.history = []; // История игр
            this.aiFirst = true; // кто первый
            this.ai = null; // Бот
            this.winner = 'Ai'; // Победитель
            this.numberOfGame = 0; // Кол-во игр
            this.totalWins = {
                "Player": 0,
                "Ai": 0
            };
            this.winningCombination = [
                [0,1,2],
                [3,4,5],
                [6,7,8],    
                [0,3,6],
                [1,4,7],
                [2,5,8],
                [0,4,8],
                [2,4,6]
            ];
        }


        newGame() {
            this.board = new Board(); //создание экз.поля для игры
            this.board.drawBoard(); // вызов метода класса для отрисовки 

            this.ai = new AiPlayer(); // создание бота

            this.addEventResetBtn(); // подписка на событие кнопки reset
            this.clickCells(); // поидписка вызова функци при клике по ячейке
            this.numberOfGame++; // количество игр
            if(this.aiFirst) { // если да, то первым идет бот
                this.aiMove();
            }
        }
        
        /**
         * Функция сброса и запуска новый игры
         */    
        reset() {      
            this.aiFirst = !this.aiFirst; // смена очереди хода
            this.gameEnd = false; 
            this.currentSymbol = 1; // x- ходит первым
            this.board.clearBoard(); // очистить поле
            this.newGame(); // запуск игры
            this.showHistory(); // показать историю
            this.showScore(); // показать счет
        }

        /**
         * Попдиска на клик по ячейки и вызов хода человека
         */    
        clickCells() {
            let cells = this.getCellsGallery();
            for(let i = 0; i < cells.length; i++) {
                cells[i].addEventListener("click", (e) => {
                    if(!this.gameEnd && !e.target.classList.contains("o") && !e.target.classList.contains("x")) {
                        this.playerMove(e); // вызов хода игрока
                    }
                });
            };
        }

        /**
         * ход человека
         */    
        playerMove(e) {
            this.winner = 'Player';  
            let currentClass = this.currentPlayer[this.currentSymbol]; // класс текущего символа
            e.target.classList.add(currentClass);

            //заполняю массив для оценки хода бота
            this.board.gameCells[e.target.getAttribute('data-row')][e.target.getAttribute('data-col')] = currentClass; 
            
            this.changeSymbol(); // смена хода
        } 


        /**
         * Ход  бота
         */    
        aiMove() {
            this.winner = 'Ai';
            let move = this.ai.botPickMove(this.board.gameCells); // вызов метода бота, возвращает координаты нового хода
            this.board.gameCells[move.i][move.j] = this.currentPlayer[this.currentSymbol]; // заполняю массив для оценки хода бота 
            let cells = this.getCellsGallery();
            setTimeout(() => {
                cells[move.index].classList.add(this.currentPlayer[this.currentSymbol]); // отрисовка выбранной ботом ячейки
                this.changeSymbol(); // смена хода
            },200); // задержка для бота
            
        }

        /**
         * Попдиска на клик кнопки ресет
         */    
        addEventResetBtn() {
            const resetBtn = document.querySelector(".status__reset");
            resetBtn.addEventListener("click", this.reset);
        }

        /**
         * Конец игры 
         */    
        gameOver() {

            this.gameEnd = true;
            let winner = this.currentPlayer[this.currentSymbol]; // текущий символ х или о

            if(this.checkWin()) {
                document.querySelector(".status__next").innerHTML = `
                <span class="who-next">${winner}</span> won`;  

            } else { // Если нет победителя , то ничья
                document.querySelector(".status__next").innerHTML = `
                <span class="who-next">Draw</span>`;  
                winner = 0;
            }

            this.addHistory(winner);
        }
        /**
         * Добавляет в историю победителя
         * Принимает класс победителя
         */    
        addHistory(winnerClass) {
            let historyItem;
            if(winnerClass){ // true если есть победитель, если нет то ничья
                historyItem = {
                    "id": this.numberOfGame,
                    "winnerClass": this.currentPlayer[this.currentSymbol],
                    "winner": this.winner
                };
                this.totalWins[`${this.winner}`]++;
            }else {
                historyItem = {
                    "id": this.numberOfGame,
                    "winnerClass": '',
                    "winner": 'Draw'
                };
            }



            this.history.push(historyItem);// добавляю в историию
            this.showHistory();// обновить историю
            this.showScore(); // обновить счет
        }

        /**
         * Показывает историю
         */    
        showHistory() {
            let historyHtml = '';
            this.history.forEach((item) => {
                historyHtml += `
                <div class="history__id">${item.id}</div>
                <div class="history__winner">${item.winner} ${item.winnerClass}</div>
                `;
            })

            document.querySelector('.history__content')
            .innerHTML = historyHtml;
        }

        /**
         * Показывает итоговый счет
         */    
        showScore() {
            document.querySelector('.score')
            .innerHTML = `
            <div class="score__ai">AI ${this.totalWins["Ai"]}</div>
            <div class="score__player">Player ${this.totalWins["Player"]}</div>`;
            
        }

        /**
         * Показывает выйигришную комбинацю
         * принимает выйигришную комбинацию
         */    
        showWiningCombination(combination) {
            let cells = this.getCellsGallery();
            combination.forEach((i) => {
                cells[i].classList.add('won');
            });
        }

        /**
         * Проверяет есть ли победитель
         * @returns boolean
         */    
        checkWin() {
            let currentClass = this.currentPlayer[this.currentSymbol];
            let cells = this.getCellsGallery();

            // Если соотвествует хотябы одна(some) из полной комбинации(every)
            return this.winningCombination.some(combination => {
                let checkComb = combination.every(index => {
                    return cells[index].classList.contains(currentClass); 
                });
                if(checkComb) {
                    this.showWiningCombination(combination); // вызов функции для показа выйгришнйо компбинации 
                }
                return checkComb;
            })
        }

        /**
         * Подсчет количества свободных ячеек
         * @return int - кол-во свободных ячеек
         */    
        getNumberOfEmptyCells() {
            let freeCell = 0;
            for(let i = 0,index = 0; i < 3; i++) {
                for(let j = 0; j < 3; j++,index++){
                    if(this.board.gameCells[i][j] === '') {
                       freeCell++;
                    }
                }
            }
            
            return freeCell;
        }

        /**
         * Получает галерею элементов ячеек
         */    
        getCellsGallery() {
            let cells = document.querySelectorAll(".game-cell");
            return cells;
        }

        /**
         * Смена хода
         */    
        changeSymbol() {
            
            //Если есть победитель или нет свободных ячеек
            if(this.checkWin() || !this.getNumberOfEmptyCells()){ 
                this.gameOver();
            }else {
                this.currentSymbol = this.currentSymbol ? 0 : 1;
                if(this.aiFirst){ // Первый всегда знак Х, но очередь меняется, запуска бота при опр.класс x или о.
                    if(this.currentSymbol)
                        this.aiMove();
                } else {
                    if(!this.currentSymbol){
                        this.aiMove();
                    }
                }
            }
            if(!this.gameEnd){ // если игра не закончена , обьявленеи кто следующий
                this.declareWhoNext();
            }
            
           
        }

        /**
         * Обьявление кто следующий
         */    
        declareWhoNext() {
            document.querySelector(".who-next").innerHTML = `${this.currentPlayer[this.currentSymbol]}`;
        }
    }

});

