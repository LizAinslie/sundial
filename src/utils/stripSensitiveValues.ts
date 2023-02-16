import { User } from "@prisma/client"

export type StrippedUser = {
  id: string;
  username: string;
  admin: boolean;
}

export const stripUser = ({ username, admin, id }: User): StrippedUser => ({ id, username, admin });

