/**
 * Конфигурация RequireJS
 */

requirejs.config({
    paths: {
        "text": "assets/libs/js/require.text",
        "css": "assets/libs/js/require.css"
    }
});


define(['app/Controllers/Game.js'], function (Game) {
    const game = new Game(); //создание новой игры
    game.newGame(); // вызова метода для запуска игры
});
