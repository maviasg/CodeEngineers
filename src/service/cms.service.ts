import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import createError from "http-errors";
import { CmsUser } from "@database/model/cms-user.model";
import constant from "@config/constant";
import { LoggedInUser } from "@type/user";
import { JWT_SECRET, TIMEZONE } from "@config/secret";
import i18n from "i18n";
import moment from "moment-timezone";
import { traceDecorator } from "@studiographene/nodejs-telemetry";
import { dbConnection } from "../database/db-connection";

export class CmsService {
  private cmsUserRepository;
  constructor() {
    moment.tz.setDefault(TIMEZONE);
    this.cmsUserRepository = dbConnection.getRepository(CmsUser);
  }

  @traceDecorator
  public async login(email: string, password: string): Promise<LoggedInUser> {
    const user = await this.cmsUserRepository.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      throw new createError.NotFound(i18n.__("user_not_found"));
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new createError.Unauthorized(i18n.__("incorrect_password"));
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, password: user.password },
      JWT_SECRET,
    );
    return { id: user.id, email: user.email, token };
  }

  /**
   * @param  {string} email user's email
   * @param  {string} password password
   * @returns Promise<CmsUser>
   */
  @traceDecorator
  public async create(email: string, password: string): Promise<CmsUser> {
    const salt = await bcrypt.genSalt(constant.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return this.cmsUserRepository.save({ email, password: hashedPassword });
  }
}
