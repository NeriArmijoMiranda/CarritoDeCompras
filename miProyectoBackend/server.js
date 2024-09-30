import express from "express";
import { Router } from 'express';
import { ProductC } from "./src/Productos/products.js";
import { CartC } from './src/carts.js'
const server = express();


// Middlewares
server.use(express.json()); // Nos permite leer archivos JSON
server.use(express.urlencoded({extended: true}));

const productsCarrito = new ProductC();

// Obtener todos los productos
server.get("/api/products", async (req, res) => {
    const products = await productsCarrito.getProducts();
console.log(products);
    res.status(200).json({ status: "ok", payload: products });
});

// Agregar un producto
server.post("/api/products", async (req, res) => {
    try {
        const newProduct = req.body; // Captura el nuevo producto del cuerpo de la solicitud
        await productsCarrito.addProduct(newProduct); // Agrega el producto usando el método correspondiente
        res.status(201).json({ status: "ok", message: "Product added successfully" });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message }); // Maneja errores
    }
});

// Obtener un producto por ID
server.get("/api/products/:pid", async (req, res) => {
    const {pid } = req.params;
    const product = await productsCarrito.getProductById(Number(pid));
if(!product) return res.status(404).json({ status: "Error", message: "Product not found"});

res.status(200).json({ status: "ok", payload: product });
});


// Actualizar un producto por ID
server.put("/api/products/:pid", async (req, res) => {
    const { pid } = req.params;
    const productData = req.body;
    try {
        await productsCarrito.updateProduct(Number(pid), productData);
        res.status(200).json({ status: "ok", message: "Producto actualizado correctamente" });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});

// Eliminar un producto por ID
server.delete("/api/products/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        await productsCarrito.deleteProduct(Number(pid));
        res.status(200).json({ status: "ok", message: "Product deleted successfully" });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});

// Se inicia el servidor en el puerto 8080
server.listen(8080, () => {
    console.log("Server on port 8080");
})

// Carrito //

const cartManager = new CartC();

// Crear un nuevo carrito
server.post('/api/carts', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ status: "ok", payload: newCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Obtener los productos del carrito
server.get('/api/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(Number(cid));
        res.status(200).json({ status: "ok", payload: cart.products });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});

// Agregar un producto al carrito
server.post('/api/carts/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.addProductToCart(Number(cid), Number(pid));
        res.status(200).json({ status: "ok", message: "Product added to cart" });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});
