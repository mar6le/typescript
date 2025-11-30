"use strict";
const userName = "Віталій";
const greeting = `Привіт, ${userName}!`;
const age = 25;
const height = 180.5;
const sum = age + height;
const isActive = true;
const isCompleted = false;
console.log(greeting);
console.log(`Вік: ${age}, Зріст: ${height} см`);
console.log(`Сума: ${sum}`);
console.log(`Активний: ${isActive}, Завершено: ${isCompleted}`);
function calculateTotal(price, quantity) {
    return price * quantity;
}
const total = calculateTotal(100, 3);
console.log(`Загальна сума: ${total}`);
