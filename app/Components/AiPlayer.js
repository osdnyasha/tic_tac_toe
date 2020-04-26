define('app/Components/AiPlayer.js', 
    ['app/Components/Component.js'], function(Component) {
        
    return class AiPlayer extends Component {

        constructor() {
            super();
        }
        
        /**
         * Функция выбора кординат для хода бота
         * Максимально глупая, либо с конца, либо с начала
         * отдает своободную ячейку
         * @returns object{row,col,index}
         */  

        botPickMove(Board) {
            if(Math.round(Math.random())) {
                for(let i = 0,index = 0; i < 3; i++) {
                    for(let j = 0; j < 3; j++,index++){
                        if(Board[i][j] === '') {
                            return {i,j,index};
                        }
                    }
                }
            } else {
                for(let i = 2,index = 8; i >= 0; i--) {
                    for(let j = 2; j >= 0; j--,index--){
                        if(Board[i][j] === '') {
                            return {i,j,index};
                        }
                    }
                }
            }
           
          }

    
}
});