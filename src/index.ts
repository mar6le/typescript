const userName: string = "Віталій";
const greeting: string = `Привіт, ${userName}!`;

const age: number = 25;
const height: number = 180.5;
const sum: number = age + height;

const isActive: boolean = true;
const isCompleted: boolean = false;

console.log(greeting);
console.log(`Вік: ${age}, Зріст: ${height} см`);
console.log(`Сума: ${sum}`);
console.log(`Активний: ${isActive}, Завершено: ${isCompleted}`);

function calculateTotal(price: number, quantity: number): number {
	return price * quantity;
}

const total: number = calculateTotal(100, 3);

console.log(`Загальна сума: ${total}`);
