import {Request, Response} from "express";

import {prisma} from "../database/prisma";

export const createProduct = async (req: Request, res: Response) => {
    const {name, price, amount} = req.body;
    const {storeId} = req.params;

    const isStoreExists = await prisma.store.findUnique({
        where: {
            id: storeId
        }
    });

    if (!isStoreExists) return res.status(400).json({error: 'Loja não existe'});

    if(price < 0 || amount < 0) return res.status(400).json({error: 'Preço e quantidade devem ser maiores que 0'});


    const product = await prisma.product.create({
        data: {
            name,
            price,
            amount,
            Store: {
                connect: {
                    id: storeId
                }
            }
        },

        select: {
            id: true,
            name: true,
            price: true,
            amount: true,
            Store: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    return res.json(product);
}

export const listProducts = async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
        select: {
            name: true,
            price: true,
            amount: true,
            Store: {
                select: {
                    name: true
                }
            }
        }
    });


    return res.json(products);
}

export const deleteAllProducts = async (req: Request, res: Response) => {
    try {
        const deleteResult = await prisma.product.deleteMany();
        const deletedCount = deleteResult.count;

        if (deletedCount === 0) {
            return res.status(400).json({ message: "Não há produtos para deletar." });
        }

        return res.status(200).json({ message: `Foram deletados ${deletedCount} produtos com sucesso.` });
    } catch (error) {
        return res.status(500).json({ message: "Ocorreu um erro ao tentar excluir os produtos.", error });
    }
};
