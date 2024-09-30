import fs from "fs";
import path from "path";
import __dirname  from "../../../dirname.js";
console.log(__dirname);

export class ProductC {
    constructor() {
        this.products = [];
        this.pathfile = __dirname + "/miProyectoBackend/src/Productos/products.js";
        console.log(this.pathfile);
    }

    async getProducts() {
        try {
            const productsJson = await fs.promises.readFile(this.pathfile, "utf-8");
        const productsParse = JSON.parse(productsJson);
        this.products = productsParse || []; 
        return (this.products);
        } catch (error) {
            console.log(`Error: ${error.message}`)
        }
    }

    async getProductById(id) {

        try {
            await this.getProducts();
            const findProduct = this.products.find((product) => product.id === Number(id));
            if (!findProduct) throw new Error("Producto no encontrado");
            return findProduct;            
        } catch (error) {
            console.log(`Error: ${error.message}`)
        }
    }

    async addProduct(product) {
        try {
        const { title, description, price, thumbnail, code, stock } = product;
    
        const newProduct = {
            id: this.products.length + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };


        const productExist = this.products.find((product) => product.code === code);
        if (productExist) throw new Error((`Error: El producto con el código ${code} ya existe`));
        const arrayValues = Object.values(newProduct);
    
        if (arrayValues.includes(undefined)) throw new Error("Todos los datos son obligatorios");
    
        this.products.push(newProduct);
            await fs.promises.writeFile(this.pathfile, JSON.stringify(this.products));
    
        } catch (error) {
            console.log(`Error: ${error.message}`);
            }
            
            
        }
    
        async updateProduct(id, productData) {
            try {
                await this.getProducts();
                const index = this.products.findIndex((product) => product.id === id); // Si no encuentra el elemento que coincide, devuelve un -1
                if(index == -1) throw new Error("Product not found");
                    this.products[index] = {
                ...this.products[index], // Copiamos todos los valores originales
                ...productData, // Sobre escribimos los nuevos valores 
            };
    
            await fs.promises.writeFile(this.pathfile, JSON.stringify(this.products));
            /* console.log(this.products); */
            /*     console.log(index);
                
                console.log(this.products[index]); */
    
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
        }
            async deleteProduct(id) {
                try {
                    await this.getProducts();
                    await this.getProductById(id);
            this.products = this.products.filter((product) => product.id !== id);
    
            await fs.promises.writeFile(this.pathfile, JSON.stringify(this.products));
                } catch (error) {
                    console.log(`Error: ${error.message}`);
                }
            
            }
    }


