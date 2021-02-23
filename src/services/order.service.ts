import {NextFunction, Request, Response} from "express";
import logger from "../libs/logger";
import {ackGenericError, ackOk, ackOrderAlreadyExists} from "../constants/messages.constants";
import { Order, iOrder } from "../models/order.model";

/***
 * Crea una orden, si es que aún no existe
 * en la base de datos.
 * @param req
 * @param res
 */
export let orderCreate = async(req: Request, res: Response) => {
    try{
        logger.info('Ingrese en order.service.create');
        await Order.create(req.body);
        res.status(200).send({ack: ackOk})
    }
    catch(err){
        logger.error(`Error en order.service.create = ${err}`);
        res.status(500).send({ack: ackGenericError})
    }
}
/***
 * Valido que el numero de orden no exista
 * ya en la base de datos.
 * @param req
 * @param res
 * @param next
 */
export let orderValidateNumber = async(req: Request, res:Response, next: NextFunction) => {
    try{
        logger.info('Ingrese en order.service.orderValidateNumber');
        /***Paso 1, buscar si existe en la DB***/
        const order = await Order.findOne({internalNumber: parseInt(req.body.internalNumber) }).lean()
        if(order){
            return res.status(500).send({ack: ackOrderAlreadyExists})
        } else {
            next();
        }
    }
    catch(err){
        logger.error(`Error en order.service.orderValidateNumber = ${err}`);
    }
}

/***
 * Valido que el numero de orden no exista
 * ya en la base de datos.
 * @param req
 * @param res
 * @param next
 */
export let getAllOrdersByClientID = async(req: Request, res:Response, next: NextFunction) => {
    try{
        logger.info('Ingrese en order.service.getAllOrdersByClientID');
        /***Paso 1, buscar si existe en la DB***/
        const orders: iOrder[] = await Order.find({customerId: req.body.customerId }).lean()
        if(orders){
            return res.status(200).send({ack: 0, orders: orders})
        } else {
            next();
        }
    }
    catch(err){
        logger.error(`Error en order.service.getAllOrdersByClientID = ${err}`);
    }
}
