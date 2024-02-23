import { User } from "@database/model/user.model";
import { dbConnection } from "@database/db-connection";

export const UserRepo = dbConnection.getRepository(User).extend({
  findByName(name: string) {
    return this.createQueryBuilder("user")
      .select(["user.firstName", "user.lastName", "user.email"])
      .where("user.firstName = :name", { name })
      .orWhere("user.lastName = :name", { name })
      .getMany();
  },
});
