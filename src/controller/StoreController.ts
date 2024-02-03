import {Request, Response} from 'express';
import {prisma} from '../database/prisma';

export const createStore = async (req: Request, res: Response) => {
    const {name} = req.body;
    const {userId} = req.params;

    const isUserExists = await prisma.user.findUnique({
        where: {
            id: parseInt(userId)
        }
    });

    if (!isUserExists) return res.status(400).json({error: 'Usuário não existe'});

    const store = await prisma.store.create({
        data: {
            name,
            User: {
                connect: {
                    id: parseInt(userId)
                }
            }
        },

        select: {
            name: true,
            User: {
                select: {
                    name: true
                }
            }
        }
    });

    return res.status(201).json(store);
}

export const listStores = async (req: Request, res: Response) => {
    const stores = await prisma.store.findMany({
        select: {
            name: true,
            User: {
                select: {
                    name: true
                }
            },
            Product: {
                select: {
                    name: true,
                    price: true
                }
            }
        }
    });

    return res.status(200).json(stores);
}

export const deleteAllStores = async (req: Request, res: Response) => {
    try {
        const deleteResult = await prisma.store.deleteMany();
        const deletedCount = deleteResult.count;

        if (deletedCount === 0) {
            return res.status(400).json({message: "Não há lojas para deletar."});
        }

        return res.status(200).json({message: `Foram deletadas ${deletedCount} lojas com sucesso.`});
    } catch (error) {
        return res.status(400).json({message: "Ocorreu um erro ao tentar excluir as lojas.", error});
    }
};
