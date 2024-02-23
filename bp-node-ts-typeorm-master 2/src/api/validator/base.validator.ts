import Joi from "@hapi/joi";
import { loginRegisterValidation, requiredStringValidation } from "./common";

const login = loginRegisterValidation;
const register = loginRegisterValidation.append({
  firstName: requiredStringValidation("firstName"),
  lastName: requiredStringValidation("lastName"),
  dob: requiredStringValidation("dob"),
  marketing: Joi.optional(),
});

export { login, register };
