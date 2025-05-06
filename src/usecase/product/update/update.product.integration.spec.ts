import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";
import {Sequelize} from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

const product = ProductFactory.create(
    "a",
    "Jujutsu Kaizen",
    40.0,
)


const input = {
    id: product.id,
    name: "Jujutsu Kaizen vol. 1",
    price: 50.0,
};


describe("Integration test for product update use case", () => {
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

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);
        productRepository.create(product);

        const output = await productUpdateUseCase.execute(input);
        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        });
    });
});
