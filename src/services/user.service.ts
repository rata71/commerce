import {NextFunction, Request, Response} from "express";
import logger from "../libs/logger";
import {User} from "../models/user.model";
import {
    ackGenericError,
    ackNoUsername,
    ackOk,
    ackUserAlreadyExists,
    ackUserNotExists
} from "../constants/messages.constants";

/***
 * Crea un usuario, recibe la información
 * en el cuerpo del JSON
 * @param req
 * @param res
 */
export const create = async(req:Request, res: Response) => {
    try{
        logger.info('Ingrese en User.create !!!')
        logger.info(`El username es ${req.body.username}`)
        await User.create(req.body)
        logger.info('Todo OK !!!')
        res.status(200).send({ack:ackOk})
    }
    catch(err){
        logger.error("Error en user.create " + err);
        res.status(500).send({ack:ackGenericError, error: err})
    }
}
/***
 * Busca un usuario por su nombre de usuario
 * @param req
 * @param res
 */
export const findByUsername = async(req:Request, res: Response) => {
    try{
        logger.info('Ingrese en User.findByUsername !!!')
        /***
         * Usamos .lean() cuando es de solo lectura
         * la consulta, es decir, no vamos a modificar
         * el registro, esto mejora la eficiencia
         */
        const user = await User.findOne(req.body).lean();

        if(user){
            /***
             * Siempre respondo con un ACK para que el invocador
             * sepa si ejecutó correctamente el método.
             */
            res.status(200).send({ack: ackOk, entity: user})
        } else {
            /***
             * Si el usuario no existe, respondo con un ack en consecuencia
             */
            res.status(200).send({ack:ackUserNotExists, error: 'El usuario no existe'})
        }

    }
    catch(err){
        logger.error("Error en user.findByUsername " + err);
        res.status(500).send({ack:999, error: err})
    }
}
/***
 * Modifico un usuario COMPLETO, es decir, en el update
 * no uso el $set como habíamos visto, por el contrario,
 * modifico el usuario completo.
 * Para ello, uso el método findOneAndUpdate
 * @param req
 * @param res
 */
export const update = async(req:Request, res: Response) => {
    try{
        logger.info('Ingrese en User.update !!!')
        logger.info(`El username es ${req.body.username}`)
        const result = await User.findOneAndUpdate({username: req.body.username}, req.body)
        if(result){
            /***
             * Si result, posee un valor, significa que el usuario
             * fue encontrado y modificado, de lo contrario,
             * el usuario no existe en la base de datos.
             */
            res.status(200).send({ack:ackOk})
        } else {
            res.status(200).send({ack:ackUserNotExists, message: 'El usuario no existe'});
        }

    }
    catch(err){
        logger.error("Error en user.findByUsername " + err);
        res.status(500).send({ack:ackGenericError, error: err})
    }
}
/***
 * Valida que el parámetro username venga informado en el body
 * en caso de existir, continúa hacia la próxima funcion
 * en caso de no venir informado, da un error.
 * @param req
 * @param res
 * @param next
 */
export let validateUsername = async(req:Request, res: Response, next: NextFunction) => {

    if(req.body.username){
        logger.info('El usuario es valido !!!!')
        next();
    } else {
        logger.error('Hubo un problema !!!')
        return res.status(200).send({ack: ackNoUsername, error: 'No enviaste el usuario'})
    }
}
/***
 * Valida que el usuario exista, si ya existe,
 * retorna un error y no lo vuelve a crear.
 * @param req
 * @param res
 * @param next
 */
export let checkUserExists = async(req:Request, res: Response, next: NextFunction) => {
    logger.info(`Error, el usuario ya existe, el JSON es: ${JSON.stringify(req.body)}`)
    const user = await User.findOne({username: req.body.username}).lean();

    if(!user) {
        next()
    } else {
        return res.status(200).send({ack:ackUserAlreadyExists, error: 'El usuario ya existe'});
    }
}

