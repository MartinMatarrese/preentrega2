import { Router } from "express";
import crypto from "crypto";
import { __dirname } from "../patch.js";
import { promises as fs } from "fs";
import path from "path";

const productRouter = Router();

const productsPath = path.resolve(__dirname, "../src/db/productos.json");

const productsData = await fs.readFile(productsPath, "utf-8");

const productos = JSON.parse(productsData);


productRouter.get("/", (req, res) => {
    const {limit} = req.query;
    const products = productos.slice(0, limit);
    res.status(200).render("templates/home", {productos: products,})
})

productRouter.get("/:pid", (req, res) => {
    const idProduct = req.params.pid;
    const product = productos.find(prod => prod.id == idProduct);
    if(product) {
        res.status(200).send(product);
    }else {
        res.status(404).send({mensaje: "El produdcto no existe"});
    }
})

productRouter.post("/", async (req, res) => {
    const {title, description, code, price, category, stock} = req.body;
    const newProduct = {
        id: crypto.randomBytes(10).toString("hex"),
        title: title,
        description: description, 
        code: code,
        price: price,
        category: category,
        stock: stock,
        status: true,
        thumbnails: []
    }
    productos.push(newProduct);
    await fs.writeFile(productsPath, JSON.stringify(productos))
    res.status(201).send({mensaje: `Producto creado correctamente con el id: ${newProduct.id}`})
})

productRouter.put("/:pid", async (req, res) => {
    const idProduct = req.params.pid;
    const {title, description, code, price, category, stock, thumbnails, status} = req.body;
    const indice = productos.findIndex(prod => prod.id == idProduct);
    if(indice != -1) {
        productos[indice].title = title
        productos[indice].description = description
        productos[indice].code = code
        productos[indice].price = price
        productos[indice].category = category
        productos[indice].stock = stock
        productos[indice].thumbnails = thumbnails
        await fs.writeFile(productsPath, JSON.stringify(productos))
        res.status(200).send({mensaje: "Producto actualizado"});
    }else {
        res.status(404).send({mensaje: "El producto no existe"});
    }
})

productRouter.delete("/:pid", async (req, res) => {
    const idProduct = req.params.pid;
    const indice = productos.findIndex(prod => prod.id == idProduct);
    if(indice != -1) {
        productos.splice(indice, 1)
        await fs.writeFile(productsPath, JSON.stringify(productos))
        res.status(200).send({mensaje: "Producto eliminado"})
    }else {
        res.status(404).send({mensaje: "El producto no existe"})
    }
})

export default productRouter