import {Request, Response} from "express";
import {prisma} from "../database/prisma";

export const createAccess = async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
        const access = await prisma.access.create({
            data: {
                name
            }
        });

        return res.status(201).json(access);
    } catch (error) {
        return res.status(400).json({ message: "Ocorreu um erro ao tentar criar o acesso.", error });
    }
};

export const getAllAccess = async (req: Request, res: Response) => {
    try {
        const access = await prisma.access.findMany();

        if (access.length === 0) {
            return res.status(400).json({ message: "Não há acessos disponíveis." });
        }

        return res.status(200).json(access);
    } catch (error) {
        return res.status(400).json({ message: "Ocorreu um erro ao tentar buscar os acessos.", error });
    }
};

export const deleteAllAccess = async (req: Request, res: Response) => {
    try {
        const deleteResult = await prisma.access.deleteMany();
        const deletedCount = deleteResult.count;

        if (deletedCount === 0) {
            return res.status(400).json({ message: "Não há acessos para deletar." });
        }

        return res.status(200).json({ message: `Foram deletados ${deletedCount} acessos com sucesso.` });
    } catch (error) {
        return res.status(400).json({ message: "Ocorreu um erro ao tentar excluir os acessos.", error });
    }
};