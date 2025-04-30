import CreateProductUseCase from "./create.product.usecase";
import {Sequelize} from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";

const product = new Product(
    "123",
    "Jujutsu Kaizen",
    40.0,
);

describe("Integration test create product use case", () => {
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
        const createProductUseCase = new CreateProductUseCase(productRepository);

        const input = {
            type: "a",
            name: "Jujutsu Kaizen",
            price: 40.0,
        };

        const result = await createProductUseCase.execute(input)
        expect(result).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        });

    });

    it("should thrown an error when name is missing", async () => {
        const productRepository = new ProductRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);

        const input = {
            type: "a",
            name: "",
            price: 40.0,
        };

        await expect(createProductUseCase.execute(input)).rejects.toThrow(
            "Name is required"
        );
    });


    it("should thrown an error when price is smaller than zero", async () => {
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        const input = {
            type: "a",
            name: "Jujutsu Kaizen",
            price: -1.0,
        };

        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            "Price must be greater than zero"
        );
    });

    it("should thrown an error when type is not supported", async () => {
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);
        const input = {
            type: "c",
            name: "Jujutsu Kaizen",
            price: 40.0,
        };

        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            "Product type not supported"
        );
    })
});
