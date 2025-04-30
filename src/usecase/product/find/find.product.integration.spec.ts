import FindProductUseCase from "./find.product.usecase";
import Product from "../../../domain/product/entity/product";
import {Sequelize} from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";

const product = new Product(
    "123",
    "Jujutsu Kaizen",
    40.0,
);

describe("Integration test find product use case", () => {
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

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const productFindUseCase = new FindProductUseCase(productRepository);
        await productRepository.create(product);

        const input = {
            id: "123",
        };

        const output = {
            id: "123",
            name: "Jujutsu Kaizen",
            price: 40.0
        };

        const result = await productFindUseCase.execute(input);

        expect(result).toEqual({
            id: expect.any(String),
            name: product.name,
            price: product.price,
        });
    });

    it("should not find a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new FindProductUseCase(productRepository);

        const input = {
            id: "12345",
        };

        await expect(usecase.execute(input)).rejects.toThrow(
            "Product not found"
        );
    });

});
