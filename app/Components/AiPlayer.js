define('app/Components/AiPlayer.js', 
    ['app/Components/Component.js'], function(Component) {
        
    return class AiPlayer extends Component {

        constructor() {
            super();
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

        botPick(classPlayer,Board) {
            const cellIndexComp = this.check_2_comp(classPlayer);
            const cellIndexUser = this.check_2_user(classPlayer);

            let cellIndex = cellIndexComp;

            if(!cellIndex) {
                cellIndex = cellIndexUser;
                if(!cellIndex)
                    return this.botPickMove(Board);
            }

            for(let i = 0,index = 0; i < 3; i++) {
                for(let j = 0; j < 3; j++,index++){
                    if(index === cellIndex) {
                        return {i,j,index};
                    }
                }
            }

        }

        check_2_comp(classPlayer){
            for (let i = 0; i < 8; i++) {
            
                const first = this.winningCombination[i][0];
                const second = this.winningCombination[i][1];
                const third = this.winningCombination[i][2];

                const cells = document.querySelectorAll('.game-cell');
                
                if(cells[first].classList.contains(classPlayer) && cells[second].classList.contains(classPlayer) && !cells[third].classList.contains('x') && !cells[third].classList.contains('o')){
                    return third;
                }
                if(cells[first].classList.contains(classPlayer) && !cells[second].classList.contains('x') && !cells[second].classList.contains('o') && cells[third].classList.contains(classPlayer) ){
                    return second;
                }
                if(!cells[first].classList.contains('x') && !cells[first].classList.contains('o') && cells[second].classList.contains(classPlayer) && cells[third].classList.contains(classPlayer) ){
                    return first;
                }	

            }
        }

        check_2_user(classPlayer){

            classPlayer = classPlayer == 'o' ? 'x' : 'o'; 

            for (let i = 0; i < 8; i++) {
            
                const first = this.winningCombination[i][0];
                const second = this.winningCombination[i][1];
                const third = this.winningCombination[i][2];

                const cells = document.querySelectorAll('.game-cell');
                
                if(cells[first].classList.contains(classPlayer) && cells[second].classList.contains(classPlayer) && !cells[third].classList.contains('x') && !cells[third].classList.contains('o')){
                    return third;
                }
                if(cells[first].classList.contains(classPlayer) && !cells[second].classList.contains('x') && !cells[second].classList.contains('o') && cells[third].classList.contains(classPlayer) ){
                    return second;
                }
                if(!cells[first].classList.contains('x') && !cells[first].classList.contains('o') && cells[second].classList.contains(classPlayer) && cells[third].classList.contains(classPlayer) ){
                    return first;
                }	

            }

        }


    
}
});