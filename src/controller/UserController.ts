import {Request, Response} from 'express';
import {prisma} from "../database/prisma";
import {hash} from "bcryptjs";

export const createUser = async (req: Request, res: Response) => {
    const {name, email, password, accessName} = req.body;

    try {
        // Verificar se o email já existe
        const isUserEmail = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (isUserEmail) {
            return res.status(400).json({error: "O email já existe."});
        }

        // Hash da senha
        const hashPassword = await hash(password, 8);

        // Criar o usuário com acesso associado
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
                userAccess: {
                    create: accessName.map((name: any) => ({
                        Access: {
                            connect: {
                                name: name
                            }
                        }
                    }))
                }
            },
            include: {
                userAccess: true // Incluindo os acessos do usuário na resposta
            }
        });

        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({message: "Ocorreu um erro ao tentar criar o usuário.", error});
    }
}

export const deleteAllUsers = async (req: Request, res: Response) => {
    try {
        const deleteResult = await prisma.user.deleteMany();
        const deletedCount = deleteResult.count;

        if (deletedCount === 0) {
            return res.status(400).json({message: "Não há usuários para deletar."});
        }

        return res.status(200).json({message: `Foram deletados ${deletedCount} usuários com sucesso.`});
    } catch (error) {
        return res.status(500).json({message: "Ocorreu um erro ao tentar excluir os usuários.", error});
    }
};


export const deleteUserByEmail = async (req: Request, res: Response) => {
    const {email} = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },

        });

        if (!user) {
            return res.status(404).json({message: "O email não foi encontrado."});
        }

        await prisma.user.delete({
            where: {
                email: email,
            },
        });

        return res.status(200).json({message: "Usuário deletado com sucesso."});
    } catch (error) {
        return res.status(500).json({message: "Ocorreu um erro ao tentar excluir o usuário.", error});
    }
};

export const listUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            userAccess: {
                select: {
                    Access: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });

    if (users.length === 0) {
        return res.status(400).json({message: "Não há usuários para listar."});
    }

    return res.status(200).json(users);
};