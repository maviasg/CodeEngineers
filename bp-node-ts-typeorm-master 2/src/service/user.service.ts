import bcrypt from "bcrypt";
import createError from "http-errors";
import i18n from "i18n";
import * as jwt from "jsonwebtoken";

import { JWT_SECRET } from "@config/secret";
import constant from "@config/constant";
import { LoggedInUser, RegisterUser, UserEmailVerification } from "@type/user";
import { User } from "@database/model/user.model";
import { logger, traceDecorator } from "@studiographene/nodejs-telemetry";
import { UserRepo } from "@database/repository/user.repository";
import { dbConnection } from "../database/db-connection";

export class UserService {
  private userRepository;
  constructor() {
    this.userRepository = dbConnection.getRepository(User);
  }
  /**
   * @param  {string} email user's email
   * @param  {string} password password
   * @returns Promise<User>
   */
  @traceDecorator
  public async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dob: string,
    marketing: string
  ): Promise<RegisterUser> {
    const userExists = await this.userRepository.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });
    if (userExists) {
      throw new createError.BadRequest(i18n.__("user_already_exists"));
    }

    const isVerified = true;
    const userUniqueKey = Math.random().toFixed(10).replace("0.", "");

    const hashedPassword = await this.getEncryptedPassword(password);
    const user = await this.userRepository.save({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: firstName.toLocaleLowerCase(),
      lastName: lastName.toLocaleLowerCase(),
      dob,
      marketing,
      userUniqueKey,
      isVerified,
    });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    return { id: user.id, email: user.email, token };
  }

  // verify registered email
  @traceDecorator
  public async verifyRegisteredUserEmail(
    uniqueKey: string
  ): Promise<UserEmailVerification> {
    const user = await this.userRepository.findOne({
      where: {
        userUniqueKey: uniqueKey,
      },
    });
    if (!user) {
      throw new createError.NotFound(i18n.__("user_not_found"));
    }
    await this.userRepository.update(
      { id: user.id, userUniqueKey: uniqueKey },
      { isVerified: true, updatedAt: new Date() }
    );

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return { id: user.id, email: user.email, token, message: "Email Verified" };
  }

  /**
   * @param  {string} email
   * @param  {string} password
   * @returns Promise
   */
  @traceDecorator
  public async login(email: string, password: string): Promise<LoggedInUser> {
    const user = await this.userRepository.findOne({
      where: {
        email: email.toLowerCase(),
        isVerified: true,
      },
    });
    if (!user) {
      throw new createError.NotFound(i18n.__("user_not_found"));
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new createError.BadRequest(i18n.__("incorrect_password"));
    }
    logger.info("user", "UserService.login", { user });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return {
      id: user.id,
      email: user.email,
      token,
    };
  }

  /**
   * Get users details
   * @returns User[]
   */
  @traceDecorator
  public async getUser(): Promise<Partial<User[]>> {
    const data = await this.userRepository.find();
    return data;
  }

  /**
   * generates a hashed string from the given string
   * @param  {string} password
   * @returns Promise for a hashed string
   */
  @traceDecorator
  private async getEncryptedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(constant.SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  /**
   * a sample custom repository function to get users by name
   * @param  {string} name
   * @returns Users
   */
  @traceDecorator
  public async getUsersByName(name: string): Promise<Partial<User[]>> {
    return UserRepo.findByName(name);
  }
}
