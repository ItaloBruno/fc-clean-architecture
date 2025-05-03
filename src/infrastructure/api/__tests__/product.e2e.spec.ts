import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "Jujutsu Kaizen",
        price: 40.0
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Jujutsu Kaizen");
    expect(response.body.price).toBe(40.0);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "Jujutsu Kaizen",
    });
    expect(response.status).toBe(500);
  });

  it("should list all product", async () => {
    const responseCreateProduct1 = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "Slam Dunk",
        price: 25.0
      });
    expect(responseCreateProduct1.status).toBe(200);

    const responseCreateProduct2 = await request(app)
        .post("/product")
        .send({
          type: "a",
          name: "Akira",
          price: 79.9
        });
    expect(responseCreateProduct2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);

    const product1 = listResponse.body.products[0];
    expect(product1.name).toBe("Slam Dunk");
    expect(product1.price).toBe(25.0);

    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe("Akira");
    expect(product2.price).toBe(79.9);

    const listResponseXML = await request(app)
    .get("/product")
    .set("Accept", "application/xml")
    .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(listResponseXML.text).toContain(`<products>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`<name>Slam Dunk</name>`);
    expect(listResponseXML.text).toContain(`<price>25</price>`);
    expect(listResponseXML.text).toContain(`</product>`);
    expect(listResponseXML.text).toContain(`<name>Akira</name>`);
    expect(listResponseXML.text).toContain(`<price>79.9</price>`);
    expect(listResponseXML.text).toContain(`</products>`);
  });
});
