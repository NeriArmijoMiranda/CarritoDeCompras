import fs from "fs";
import path from "path";
import __dirname  from "../../dirname.js";
console.log(__dirname);

export class CartC {
    constructor() {
        this.carts = [];
        this.pathfile = __dirname + "/miProyectoBackend/src/carts.js";
        console.log(this.pathfile);
    }

async getCarts() {
        try {
            const cartsJson = await fs.promises.readFile(this.pathfile, "utf-8");
        const cartsParse = JSON.parse(cartsJson);
        this.carts = cartsParse || []; 
        return (this.carts);
        } catch (error) {
            console.log(`Error: ${error.message}`)
        }
    }

async addCart() {
    const id = this.carts.length ? Math.max(this.carts.map(c => c.id)) + 1 : 1; // Generar un ID único
    const newCart = { id, products: [] }; // Estructura del nuevo carrito

    this.carts.push(newCart);
    await fs.promises.writeFile(this.pathfile, JSON.stringify(this.carts, null, 2)); // Guardar en carts.json
    return newCart; // Devolver el nuevo carrito creado
}

async getCartById(cid) {
    await this.getCarts(); // Cargar carritos desde el archivo
    const cart = this.carts.find(cart => cart.id === cid);
    if (!cart) throw new Error("Cart not found");
    return cart;
}
async addProductToCart(cid, pid) {
    await this.getCarts(); // Cargar carritos desde el archivo
    const cart = this.carts.find(cart => cart.id === cid);
    if (!cart) throw new Error("Cart not found");

}
async addProductToCart(cid, pid) {
    await this.getCarts(); // Cargar carritos desde el archivo
    const cart = this.carts.find(cart => cart.id === cid);
    if (!cart) throw new Error("Cart not found");

    const productIndex = cart.products.findIndex(p => p.product === pid);
    if (productIndex !== -1) {
        // Si el producto ya existe, incrementar la cantidad
        cart.products[productIndex].quantity += 1;
    } else {
        // Si no existe, agregar el producto con cantidad 1
        cart.products.push({ product: pid, quantity: 1 });
    }

    await fs.promises.writeFile(this.pathfile, JSON.stringify(this.carts, null, 2)); // Guardar cambios
}
}