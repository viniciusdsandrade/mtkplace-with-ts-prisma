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

        if (productWithQuantity.length === 0) return res.status(400).json({message: 'You must select at least one product'});


        let total = 0;
        for (const product of productWithQuantity) {
            total += product.price * parseInt(product.quantity);
        }

        //Algumas validações
        if (id === userSellerId) return res.status(400).json({message: 'You cannot sell to yourself'});
        if (productWithQuantity.length === 0) return res.status(400).json({message: 'You must select at least one product'});
        if (productWithQuantity.some((product: any) => product.amount < product.quantity)) return res.status(400).json({message: 'Some products are out of stock'});

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
                    Seller: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    Buyer: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    SalerProduct: {
                        select: {
                            Product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true
                                }
                            },
                            quantity: true,
                        }
                    },
                    createdAt: true
                },
            }
        );

        return res.status(200).json(sales);

    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }
};
export const getAllSalesByBuyer = async (req: Request, res: Response) => {
    const {id} = req.user;

    try {
        const sales = await prisma.sale.findMany({
                where: {
                    buyerId: id
                },
                select: {
                    id: true,
                    totalValue: true,
                    Seller: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    Buyer: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    SalerProduct: {
                        select: {
                            Product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true
                                }
                            },
                            quantity: true,
                        }
                    },
                    createdAt: true
                },
            }
        );

        return res.status(200).json(sales);
    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }
}
export const getAllSalesBySeller = async (req: Request, res: Response) => {
    const {id} = req.user;

    try {
        const sales = await prisma.sale.findMany({
                where: {
                    sellerId: id
                },
                select: {
                    id: true,
                    totalValue: true,
                    Seller: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    Buyer: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    SalerProduct: {
                        select: {
                            Product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true
                                }
                            },
                            quantity: true,
                        }
                    },
                    createdAt: true
                },
            }
        );

        return res.status(200).json(sales);
    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }
}
