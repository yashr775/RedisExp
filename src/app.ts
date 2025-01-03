import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { singleUpload } from "./multer.js";
import { rm } from "fs";
import { Product } from "./productModel.js";
import redis from "redis"


const DEFAULT_EXPIRATION = 3600;

const redisClient = redis.createClient();

redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
  });

  (async () => {
    await redisClient.connect();
    console.log("Connected to Redis");
  })();

dotenv.config({ path: ".env" });

const app = express();
const mongoUrl = process.env.MONGO_URL || "";
app.use(express.json());

const connectDB = (url: string) => {
  mongoose
    .connect(url, { dbName: "RedisDemo" })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.error(e.message));
};

connectDB(mongoUrl);

interface ProductType {
  _id?: string;
  name: string;
  photo: string;
  price: number;
  stock: number;
}

app.post(
  "/create",
  singleUpload,
  async (req: Request<{}, {}, ProductType>, res: Response) => {
    const { name, price, stock } = req.body;
    const photo = req.file;

    if (!photo) {
      res.status(400).send({ success: false, message: "please send photo" });
      return;
    }

    if (!name || !price || !stock) {
      if (photo?.path)
        rm(photo?.path, () => {
          console.log("file deleted");
        });
      return;
    }
    const product = await Product.create({
      name,
      price,
      stock,
      photos: photo.path,
    });

    res.status(200).send({success:true,product})

    return;

  }
);

app.get("/getAll",async (req,res) => {

    const products = await Product.find({});
      redisClient.setEx('data',DEFAULT_EXPIRATION,JSON.stringify(products))
    res.status(200).send({success:true,products})
    return;
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});
