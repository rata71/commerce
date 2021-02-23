import { Application } from "express";
import * as userService from "./services/user.service"
import * as orderService from "./services/order.service"
import {checkUserExists} from "./services/user.service";

export class Controller {
  constructor(private app: Application) {
    this.routes();
  }
  public routes() {
    this.app.route('/api/v1/users/create').post([userService.validateUsername, checkUserExists], userService.create)
    this.app.route('/api/v1/users/find-by-username').get([userService.validateUsername], userService.findByUsername)
    this.app.route('/api/v1/users/update').post([userService.validateUsername], userService.update)
    /***
     * Manejo de ordenes
     */
    this.app.route('/api/v1/orders/create').post([orderService.orderValidateNumber],orderService.orderCreate);
    this.app.route('/api/v1/orders/get').get(orderService.getAllOrdersByClientID);
  }
}
