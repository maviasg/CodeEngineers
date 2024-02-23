import express from "express";
import { BaseController } from "@api/controller/base.controller";
import { HttpRequestValidator } from "@middleware/http-request-validator";
import { login, register } from "@api/validator/base.validator";
import { AuthenticateRequest } from "@middleware/authenticate-request";

class BaseRoute {
  public router: express.Router = express.Router();
  private baseController: BaseController;
  private httpRequestValidator: HttpRequestValidator;
  private authenticate;

  constructor() {
    this.baseController = new BaseController();
    this.httpRequestValidator = new HttpRequestValidator();
    const authMiddleware = new AuthenticateRequest();
    this.authenticate = authMiddleware.validate;
    this.assign();
  }

  private assign(): void {
    this.router.post(
      "/register",
      this.httpRequestValidator.validate("body", register),
      this.baseController.register,
    );

    this.router.get(
      "/user-email-verification/:uniqueKey",
      this.baseController.verifyUserEmail,
    );

    this.router.post(
      "/login",
      this.authenticate,
      this.httpRequestValidator.validate("body", login),
      this.baseController.login,
    );

    this.router.get("/get-user-details", this.baseController.getUser);

    this.router.get("/users-by-name", this.baseController.getUsersByName);

    this.router.get("/", this.baseController.defaultCheck);
  }
}

export default new BaseRoute().router;
