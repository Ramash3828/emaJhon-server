const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vxf4n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});
async function run() {
    try {
        await client.connect();
        const productCollection = client.db("emaJhon").collection("products");
        // Load Data
        app.get("/product", async (req, res) => {
            const page = parseInt(req.query.page);
            const qty = parseInt(req.query.quantity);
            const query = {};
            const cursor = productCollection.find(query);
            let products;
            if (page || qty) {
                products = await cursor
                    .skip(page * qty)
                    .limit(qty)
                    .toArray();
            } else {
                products = await cursor.toArray();
            }
            res.send(products);
        });

        // Count Data
        app.get("/productcount", async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count });
        });

        // POST data by keys
        app.post("/productById", async (req, res) => {
            const keys = req.body;
            const ids = keys.map((id) => ObjectId(id));
            const query = { _id: { $in: ids } };
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
            // res.send(keys);
            console.log(keys);
        });
    } finally {
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello ema-jhon");
});

app.listen(port, () => {
    console.log("ema-jhon server is running", port);
});
