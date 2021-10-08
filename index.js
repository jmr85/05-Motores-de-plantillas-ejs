const express = require('express');
const app = express();

const ContenedorClass = require("./Contenedor");
let contenedor = new ContenedorClass('./data/products.txt');

const PORT = process.env.PORT || 8080;

app.use(express.json()); //body-parser(deprecated)
app.use(express.urlencoded({ extended: false }));

app.set("views", "./views");
app.set("view engine", "ejs");

// GET form
app.get('/', function (req, res) {
    // Rendering form
    res.render("index", { titulo: "Formulario Guardar Producto" });
});

// POST save form
app.post('/saveProduct', async (req, res) => {
    const { title, price, thumbnail } = req.body;

    try {
        await contenedor.save(title, price, thumbnail);
        res.redirect('/products');
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al guardar productos !!!",
        });
    }

});

// GET all
app.get('/products', async (req, res) => {
    let contenido;
    try {
        contenido = await contenedor.getAll();
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al devolver los productos !!!",
        });
    }
    res.render("products", { data: JSON.parse(contenido) });
});

app.listen(PORT, () => {
    console.log(`Server is run on port ${PORT}`);
}).on('error', err => console.log(err));
