const { todo } = require('node:test')

const fs = require('fs').promises

class ProductManager{

    constructor(ruta){
        this.path = ruta
    }

    async addProduct(title, description, price, thumbnail, code, stock){
        try{
            if(title === "" || description === "" || price === "" || thumbnail === "" || code === "" || stock ===""){
                console.log("Debe ingresar todos los campos requeridos!")
                return
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
                console.log("Producto agregado correctamente")
                return
            } 
        }catch(error){
            console.log("Ocurrió un error al agregar el producto: " + error)
        }     
    }

    async getProducts(){
        try {
            const productos = await fs.readFile(this.path, 'utf-8')
            if(productos.length>0){
                //console.log(productos)
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
                }else{
                return console.log("No existe el producto")
                }
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
        return console.log("Producto eliminado correctamente")
        }catch(eror){
            console.log("Ocurrió un error al borrar el producto: " + idIngresado)
        }
    }

    async updateProduct(idActualizar, campoActualizar, nuevoValor){
        try{
        let todosLosProductos = await this.getProducts()
        let index = todosLosProductos.findIndex((p)=>p.id === idActualizar)
        if (index === -1){
            throw new Error("No existe el id seleccionado") 
        } 
        todosLosProductos[index][campoActualizar] = nuevoValor
        await fs.writeFile(this.path, JSON.stringify(todosLosProductos, null, "\t"))
        return todosLosProductos[index]
        }catch(error){
            console.log("Ocurrió un error al actualizar los datos: " + error)
        }
    }
}

let prueba1 = new ProductManager("Productos.json")
prueba1.addProduct("Tomate", "Verdulería", 110, "asd", 111, 3)
prueba1.addProduct("Lechuga", "Verdulería", 200, "awr", 222, 7)
//prueba1.getProductById(1)
//prueba1.deleteProduct(3)
prueba1.updateProduct(2,"precio",300)
.then((rta)=>{console.log("Actualizado correstamente: "+rta)})
.catch((e)=>{console.log(e)})