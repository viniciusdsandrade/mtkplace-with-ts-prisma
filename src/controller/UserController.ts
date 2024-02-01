import {Request, Response} from 'express';
import {prisma} from "../database/prisma";
import {Prisma} from "@prisma/client";
import {hash} from "bcryptjs";

export const createUser = async (req: Request, res: Response) => {
    const {name, email, password, accessName} = req.body;

    const isUserEmail = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (isUserEmail) return res.status(400).json({error: "Email already exists"});

    const hashPassword = await hash(password, 8)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
            Access: {
                connect: {
                    name: accessName
                }
            }
        }
    });
    return res.status(201).json(user);
}

export const deleteAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.deleteMany();
        return res.status(204).json(users);
    } catch (e) {
        return res.status(500).json(e);
    }
}

export const deleteUserByEmail = async (req: Request, res: Response) => {
    try {
        const {email} = req.body;
        const user = await prisma.user.delete({
            where: {
                email,
            },
        });

        // Se o usuário foi excluído com sucesso, retorna um status 204 (No Content) e um aviso que foi excluído
        return res.status(204).json({message: "User deleted"});
    } catch (error) {
        // Se o usuário não for encontrado, lança um status 404 (Not Found)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return res.status(404).json({error: "Email not found"});
        }

        // Se houver outros erros, retorna um status 500 (Internal Server Error)
        console.error("Erro ao excluir usuário:", error);
        return res.status(500).json({error: "Erro interno do servidor ao excluir usuário"});
    }
};

export const listUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
        include: {
            Access: true
        }
    });
    return res.status(200).json(users);
}