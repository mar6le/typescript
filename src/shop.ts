type BaseProduct = {
	id: number;
	name: string;
	price: number;
	description: string;
	inStock: boolean;
};

type Electronics = BaseProduct & {
	category: "electronics";
	brand: string;
	warrantyMonths: number;
	powerConsumption: number;
};

type Clothing = BaseProduct & {
	category: "clothing";
	size: string;
	color: string;
	material: string;
};

type Book = BaseProduct & {
	category: "books";
	author: string;
	pages: number;
	isbn: string;
};

const findProduct = <T extends BaseProduct>(products: T[], id: number): T | undefined => {
	return products.find((product: T) => product.id === id);
};

const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
	return products.filter((product: T) => product.price <= maxPrice);
};

const filterByCategory = <T extends BaseProduct>(products: T[], category: string): T[] => {
	return products.filter((product: T) => "category" in product && (product as any).category === category);
};

const sortByPrice = <T extends BaseProduct>(products: T[], ascending: boolean = true): T[] => {
	return [...products].sort((a: T, b: T) => (ascending ? a.price - b.price : b.price - a.price));
};

type CartItem<T> = {
	product: T;
	quantity: number;
};

const addToCart = <T extends BaseProduct>(cart: CartItem<T>[], product: T, quantity: number): CartItem<T>[] => {
	if (quantity <= 0) {
		console.log("Кількість повинна бути більше 0");
		return cart;
	}

	if (!product.inStock) {
		console.log(`Товар "${product.name}" відсутній на складі`);
		return cart;
	}

	const existingItem: CartItem<T> | undefined = cart.find((item: CartItem<T>) => item.product.id === product.id);

	if (existingItem !== undefined) {
		existingItem.quantity += quantity;
		return cart;
	}

	return [...cart, { product, quantity }];
};

const removeFromCart = <T extends BaseProduct>(cart: CartItem<T>[], productId: number): CartItem<T>[] => {
	return cart.filter((item: CartItem<T>) => item.product.id !== productId);
};

const updateQuantity = <T extends BaseProduct>(
	cart: CartItem<T>[],
	productId: number,
	quantity: number,
): CartItem<T>[] => {
	if (quantity <= 0) {
		return removeFromCart(cart, productId);
	}

	return cart.map((item: CartItem<T>) => (item.product.id === productId ? { ...item, quantity } : item));
};

const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
	return cart.reduce((total: number, item: CartItem<T>) => total + item.product.price * item.quantity, 0);
};

const getCartItemCount = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
	return cart.reduce((count: number, item: CartItem<T>) => count + item.quantity, 0);
};

const findCheapestProduct = <T extends BaseProduct>(products: T[]): T | undefined => {
	if (products.length === 0) return undefined;
	return products.reduce((cheapest: T, current: T) => (current.price < cheapest.price ? current : cheapest));
};

const findMostExpensiveProduct = <T extends BaseProduct>(products: T[]): T | undefined => {
	if (products.length === 0) return undefined;
	return products.reduce((expensive: T, current: T) => (current.price > expensive.price ? current : expensive));
};

const getAveragePrice = <T extends BaseProduct>(products: T[]): number => {
	if (products.length === 0) return 0;
	const total: number = products.reduce((sum: number, product: T) => sum + product.price, 0);
	return total / products.length;
};

const electronics: Electronics[] = [
	{
		id: 1,
		name: "iPhone 15 Pro",
		price: 45000,
		description: "Флагманський смартфон від Apple",
		inStock: true,
		category: "electronics",
		brand: "Apple",
		warrantyMonths: 12,
		powerConsumption: 20,
	},
	{
		id: 2,
		name: "Samsung Galaxy S24",
		price: 38000,
		description: "Потужний Android смартфон",
		inStock: true,
		category: "electronics",
		brand: "Samsung",
		warrantyMonths: 24,
		powerConsumption: 18,
	},
	{
		id: 3,
		name: "MacBook Pro 16",
		price: 95000,
		description: "Професійний ноутбук для розробників",
		inStock: false,
		category: "electronics",
		brand: "Apple",
		warrantyMonths: 12,
		powerConsumption: 140,
	},
];

const clothing: Clothing[] = [
	{
		id: 4,
		name: "Футболка Nike",
		price: 1200,
		description: "Спортивна футболка з бавовни",
		inStock: true,
		category: "clothing",
		size: "L",
		color: "Чорний",
		material: "Бавовна 100%",
	},
	{
		id: 5,
		name: "Джинси Levi's",
		price: 3500,
		description: "Класичні джинси",
		inStock: true,
		category: "clothing",
		size: "32",
		color: "Синій",
		material: "Деним",
	},
];

const books: Book[] = [
	{
		id: 6,
		name: "Clean Code",
		price: 850,
		description: "Книга про чистий код",
		inStock: true,
		category: "books",
		author: "Robert Martin",
		pages: 464,
		isbn: "978-0132350884",
	},
	{
		id: 7,
		name: "TypeScript Handbook",
		price: 650,
		description: "Повний посібник з TypeScript",
		inStock: true,
		category: "books",
		author: "Microsoft",
		pages: 320,
		isbn: "978-1234567890",
	},
];

console.log("=== ТЕСТУВАННЯ СИСТЕМИ ІНТЕРНЕТ-МАГАЗИНУ ===\n");

console.log("=== ПОШУК ТОВАРІВ ===");
const foundPhone: Electronics | undefined = findProduct(electronics, 1);
console.log("Знайдений товар:", foundPhone?.name);

const foundBook: Book | undefined = findProduct(books, 6);
console.log("Знайдена книга:", foundBook?.name);

console.log("\n=== ФІЛЬТРАЦІЯ ЗА ЦІНОЮ ===");
const affordableElectronics: Electronics[] = filterByPrice(electronics, 50000);
console.log(`Електроніка до 50000 грн (${affordableElectronics.length} товарів):`);
affordableElectronics.forEach((product: Electronics) => {
	console.log(`  - ${product.name}: ${product.price} грн`);
});

const cheapBooks: Book[] = filterByPrice(books, 700);
console.log(`\nКниги до 700 грн (${cheapBooks.length} товарів):`);
cheapBooks.forEach((product: Book) => {
	console.log(`  - ${product.name}: ${product.price} грн`);
});

console.log("\n=== СОРТУВАННЯ ЗА ЦІНОЮ ===");
const sortedElectronics: Electronics[] = sortByPrice(electronics, true);
console.log("Електроніка (від дешевих до дорогих):");
sortedElectronics.forEach((product: Electronics) => {
	console.log(`  - ${product.name}: ${product.price} грн`);
});

console.log("\n=== РОБОТА З КОШИКОМ ===");
let cart: CartItem<Electronics | Clothing | Book>[] = [];

if (foundPhone !== undefined) {
	cart = addToCart(cart, foundPhone, 1);
	console.log(`Додано в кошик: ${foundPhone.name} x1`);
}

const shirt: Clothing | undefined = findProduct(clothing, 4);
if (shirt !== undefined) {
	cart = addToCart(cart, shirt, 2);
	console.log(`Додано в кошик: ${shirt.name} x2`);
}

if (foundBook !== undefined) {
	cart = addToCart(cart, foundBook, 1);
	console.log(`Додано в кошик: ${foundBook.name} x1`);
}

const macbook: Electronics | undefined = findProduct(electronics, 3);
if (macbook !== undefined) {
	cart = addToCart(cart, macbook, 1);
}

console.log(`\nТоварів у кошику: ${getCartItemCount(cart)}`);
console.log("Вміст кошика:");
cart.forEach((item: CartItem<Electronics | Clothing | Book>) => {
	console.log(`  - ${item.product.name} x${item.quantity} = ${item.product.price * item.quantity} грн`);
});

const total: number = calculateTotal(cart);
console.log(`\nЗагальна вартість: ${total} грн`);

console.log("\n=== ОНОВЛЕННЯ КІЛЬКОСТІ ===");
cart = updateQuantity(cart, 4, 3);
console.log("Оновлено кількість футболок до 3");
console.log(`Нова загальна вартість: ${calculateTotal(cart)} грн`);

console.log("\n=== ВИДАЛЕННЯ З КОШИКА ===");
cart = removeFromCart(cart, 6);
console.log("Видалено книгу з кошика");
console.log(`Товарів у кошику: ${getCartItemCount(cart)}`);
console.log(`Загальна вартість: ${calculateTotal(cart)} грн`);

console.log("\n=== СТАТИСТИКА ТОВАРІВ ===");
const allProducts: (Electronics | Clothing | Book)[] = [...electronics, ...clothing, ...books];

const cheapest: Electronics | Clothing | Book | undefined = findCheapestProduct(allProducts);
console.log(`Найдешевший товар: ${cheapest?.name} - ${cheapest?.price} грн`);

const mostExpensive: Electronics | Clothing | Book | undefined = findMostExpensiveProduct(allProducts);
console.log(`Найдорожчий товар: ${mostExpensive?.name} - ${mostExpensive?.price} грн`);

const avgPrice: number = getAveragePrice(allProducts);
console.log(`Середня ціна товару: ${Math.round(avgPrice)} грн`);

console.log("\n=== СИСТЕМА ПРАЦЮЄ КОРЕКТНО ===");
