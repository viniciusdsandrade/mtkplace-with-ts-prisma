import {Request, Response} from 'express';
import {prisma} from "../database/prisma";

export const createSale = async (req: Request, res: Response) => {
    const {products, userSellerId} = req.body;
    const {id} = req.user;

    try {
        const productsByDatabase = await prisma.product.findMany({
            where: {
                id: {
                    in: products.map((product: any) => product.id)
                }
            },
            select: {
                id: true,
                name: true,
                price: true,
                amount: true,
                storeId: true
            }
        });

        const productWithQuantity = productsByDatabase.map((product: any) => {
            const {id, name, price} = product;
            const quantity = products.find((product: any) => product.id === id).quantity;
            return {
                id,
                name,
                price,
                quantity
            }
        });

        let total = 0;
        for (const product of productWithQuantity) {
            total += product.price * parseInt(product.quantity);
        }

        const sale = await prisma.sale.create({
            data: {
                totalValue: total,
                sellerId: userSellerId,
                buyerId: id,
                SalerProduct: {
                    create: productWithQuantity.map((product: any) => ({
                        Product: {connect: {id: product.id}},
                        quantity: parseInt(product.quantity),
                    }))
                }
            },
            include: {
                SalerProduct: {
                    select: {
                        id: true,
                        quantity: true,
                        productId: true,
                        saleId: true
                    }
                },
            }
        });

        productWithQuantity.map(async (product: any) => {
            await prisma.product.updateMany({
                where: {id: product.id},
                data: {
                    amount: {
                        decrement: parseInt(product.quantity)
                    }
                }
            });
        });

        return res.status(201).json({message: 'Sale created successfully', sale});

    } catch
        (error) {
        return res.status(500).json({message: 'Internal server error'});
    }
};

export const getAllSales = async (req: Request, res: Response) => {
    try {
        const sales = await prisma.sale.findMany(
            {
                select: {
                    id: true,
                    totalValue: true,
                    sellerId: true,
                    SalerProduct: {
                        select: {
                            quantity: true,
                            Product: {
                                select: {
                                    name: true,
                                    price: true
                                }
                            }
                        }
                    },
                    buyerId: true,
                }
            }
        );

        return res.status(200).json(sales);

    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }
};

