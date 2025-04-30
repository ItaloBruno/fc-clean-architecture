import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";
import {Sequelize} from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

const product1 = new Product(
    "123",
    "Jujutsu Kaizen",
    40.0,
);

const product2 = new Product(
    "12345",
    "Slam Dunk",
    35.9,
);


describe("Integration test for listing product use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should list a product", async () => {
        const productRepository = new ProductRepository();
        productRepository.create(product1);
        productRepository.create(product2);

        const useCase = new ListProductUseCase(productRepository);
        const output = await useCase.execute({});

        expect(output.products.length).toBe(2);
        expect(output.products[0].name).toBe(product1.name);
        expect(output.products[0].price).toBe(product1.price);
        expect(output.products[1].name).toBe(product2.name);
        expect(output.products[1].price).toBe(product2.price);
    });
});
