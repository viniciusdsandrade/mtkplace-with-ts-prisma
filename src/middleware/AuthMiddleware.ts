//Validar as permições que o usuário possui
import {Request, Response, NextFunction} from "express";
import {prisma} from "../database/prisma";
import {verify} from "jsonwebtoken";

export interface DecodedToken {
    userId: string;
}

export function authMiddleware(permissions?: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.includes("Bearer ")) {
            return res.status(401).json({message: "Token não informado."});
        }

        const token = authHeader.substring(7);

        try {
            const MY_SECRET_KEY = process.env.JWT_SECRET;
            if (!MY_SECRET_KEY) {
                throw new Error("Chave secreta não encontrada.");
            }

            const decoded = verify(token, MY_SECRET_KEY) as DecodedToken;

            req.user = {
                id: decoded.userId
            }

            if (permissions) {
                const user = await prisma.user.findUnique({
                    where: {
                        id: decoded.userId,
                    },
                    include: {
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

                const userPermissions = user?.userAccess.map((name) => name.Access?.name) ?? [];
                const hasPermission = permissions.some((permission) => userPermissions.includes(permission));

                if (!hasPermission) {
                    return res.status(403).json({message: "Usuário não tem permissão para acessar este recurso."});
                }
            }

            return next();

        } catch (error) {
            return res.status(401).json({message: "Token inválido."});
        }
    }
}