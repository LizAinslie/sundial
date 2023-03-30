import { User } from "@prisma/client";

export type StrippedUser = {
  id: string;
  username: string;
  admin: boolean;
  expirePassword: boolean;
  enabled: boolean;
  createdAt: Date,
  updatedAt: Date,
};

export const stripUser = ({ 
  username,
  admin,
  id,
  expirePassword,
  enabled,
  createdAt,
  updatedAt,
}: User): StrippedUser => ({
  id,
  username,
  admin,
  expirePassword,
  enabled,
  createdAt,
  updatedAt,
});

