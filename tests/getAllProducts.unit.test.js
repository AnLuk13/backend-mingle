import { describe, expect, it, jest } from "@jest/globals";
import { getAllProducts } from "../controllers/productsController.js";
import { Product } from "../models/productModel.js";

// Create mock product based on your provided object
const sheenChair = {
  _id: "66e99ccb33882fb50d1750e6",
  name: "Sheen Chair",
  category: "Furniture",
  description: "A modern sheen chair with a comfortable back and seat.",
  price: 199.99,
  currency: "USD",
  stock: 20,
  color: "Orange",
  dimensions: {
    width: 0.6,
    length: 0.8,
    height: 1.2,
  },
  modelSrc: "/assets/models/sheenchair.glb",
  iOSSrc: "/assets/models/sheenchair.usdz",
  annotations: [
    {
      title: "comfortable-back",
      slot: "hotspot-1",
      position:
        "0.011597651675006926m 0.5744572599492905m -0.1383899854988515m",
      normal: "0.028332494851243895m 0.2137467602998606m 0.9764781575625839m",
      orbit: "10.89188deg 119.9775deg 0.03543022m",
      target: "-0.1053838m 0.01610652m 0.1076345m",
      _id: "66e99ccb33882fb50d1750e7",
    },
    {
      title: "comfortable-seat",
      slot: "hotspot-2",
      position: "0.008754174027053235m 0.3513235856998005m 0.1658749505478343m",
      normal:
        "-0.30988561688489596m 0.9507625837296717m -0.004627507703580716m",
      orbit: "10.89188deg 119.9775deg 0.03543022m",
      target: "-0.1053838m 0.01610652m 0.1076345m",
      _id: "66e99ccb33882fb50d1750e8",
    },
  ],
  brand: "Luxury Chairs",
  discount: false,
  createdAt: new Date("2024-09-18T00:00:59.921Z"),
  updatedAt: new Date("2024-09-18T00:00:59.921Z"),
  __v: 0,
};

describe("Unit Test: getAllProducts", () => {
  it("should return a list with the Sheen Chair", async () => {
    jest.spyOn(Product, "find").mockResolvedValue([sheenChair]);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllProducts(req, res);

    expect(Product.find).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      count: 1,
      data: [sheenChair],
    });

    Product.find.mockRestore();
  });
});
