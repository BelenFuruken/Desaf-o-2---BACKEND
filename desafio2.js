const { todo } = require('node:test')

const fs = require('fs').promises

class ProductManager{

    constructor(ruta){
        this.path = ruta
    }

    async addProduct(title, description, price, thumbnail, code, stock){
        try{
            if(title === "" || description === "" || price === "" || thumbnail === "" || code === "" || stock ===""){
                return console.log("Debe ingresar todos los campos requeridos!")
            } 
            let todosLosProductos = await this.getProducts() 
            let existe = todosLosProductos.find((p)=>p.codigo === code)
            if(existe){
                console.log("Ya existe este codigo")
                return
            }else{
                let id = 1
                if(todosLosProductos.length>0){
                    id = todosLosProductos[todosLosProductos.length-1].id +1
                }
                todosLosProductos.push({
                    id: id,
                    nombre: title,
                    descrip: description,
                    precio: price,
                    img: thumbnail,
                    codigo: code,
                    cantidad: stock
                })
                await fs.writeFile(this.path, JSON.stringify(todosLosProductos, null, "\t"))
                return console.log("Producto agregado correctamente")
            } 
        }catch(error){
            console.log("Ocurrio un error al agregar el producto: " + error)
        }     
    }

    async getProducts(){
        try {
            const productos = await fs.readFile(this.path, 'utf-8')
            console.log(productos)
            if(productos.length>0){
                return JSON.parse(productos)
            }
            return []

        }catch(error) {
            if (error.code === 'ENOENT') {
                return []
            } else {
                throw error
            }
        }
    }

    async getProductById(idIngresado){
        try{
            let todosLosProductos = await this.getProducts()
            if(todosLosProductos.length>0){
                let productoBuscado = todosLosProductos.filter(p => p.id === idIngresado)
                if(productoBuscado.length>0){
                    return console.log(productoBuscado)
                }
                return console.log("No existe el producto")
            }
            return console.log("Todavía no hay nigún producto")
        }catch(error){
            console.log("Ocurrió un error al buscar el producto: " + error)
        }
    }

    async deleteProduct(idIngresado){
        try{
        let todosLosProductos = await this.getProducts()
        let nuevaLista = todosLosProductos.filter(p => p.id !== idIngresado)
        if(nuevaLista.length === todosLosProductos.length){
            return console.log("No existe el id ingresado")
        }
        await fs.writeFile(this.path, JSON.stringify(nuevaLista, null, "\t"))
        }catch(eror){
            console.log("Ocurrió un error al borrar el producto: " + idIngresado)
        }
    }

    async updateProduct(idActualizar, campoActualizar, nuevoValor){
        try{
        let todosLosProductos = await this.getProducts()
        let existe = todosLosProductos.find(p => p.id === idActualizar)
        if (existe){
            todosLosProductos[idActualizar].campoActualizar = nuevoValor
            await fs.writeFile(this.path, JSON.stringify(todosLosProductos, null, "\t"))
            return
        }
        console.log("No existe dicho id")
        }catch(error){
            console.log("Ocurrió un error al actualizar los datos: " + error)
        }
    }
}

let prueba1 = new ProductManager("Productos.json")
prueba1.addProduct("Tomate", "Verdulería", 110, "asd", 111, 3)
prueba1.addProduct("Lechuga", "Verdulería", 200, "awr", 222, 7)
//prueba1.getProductById(2)
prueba1.getProducts()
prueba1.deleteProduct(1)
prueba1.updateProduct(2,"precio",300)