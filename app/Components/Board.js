define('app/Components/Board.js', 
    ['app/Components/Component.js'], function(Component) {

        return class Board extends Component {

            constructor() {
                super();
                this.gameCells = [
                    ['', '', ''],
                    ['', '', ''],
                    ['', '', '']
                  ];
            }

            /**
             * Отрисовка поля
             * 
             */  
            drawBoard() {
                let cells = '';
                for(let i = 0; i < 3; i++) {
                    for(let j = 0; j < 3; j++) {
                        cells += `<div class="game-cell" data-row=${i} data-col=${j} ></div>`;
                    }
                }

                document.body.innerHTML = `
                <div class="container">
                    <h1 class="title">Tic <span class="color_white">Tac</span> Toe</h1>
                    <div class="status">
                        <div class="status__next"><span class="who-next">X</span> is next</div>
                        <div class="status__reset">Reset</div>
                    </div>
                    <div class="game-grid">${cells}</div>
                </div>
                <div class="container history-info">
                    <h1 class="title title_gray">Score</h1>
                    <div class="score">
                        <div class="score__ai">AI</div>
                        <div class="score__player">Player</div>
                    </div>
                    <h1 class="title">Games history</h1>
                    <div class="history__head">
                        <div class="history__id">Game ID</div>
                        <div class="history__winner">Winner</div>
                    </div>
                    <div class="history__content">
                        <div class="history__id"></div>
                        <div class="history__winner"></div>
                    </div>
                </div>
                `;
            }

            /**
             * Очистка поля
             */  
            clearBoard() {
                document.body.innerHTML = '';
            }
        }
});