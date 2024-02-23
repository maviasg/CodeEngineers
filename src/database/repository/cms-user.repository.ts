import { CmsUser } from "@database/model/cms-user.model";

import { dbConnection } from "@database/db-connection";

export const CmsUserRepo = dbConnection.getRepository(CmsUser).extend({});
