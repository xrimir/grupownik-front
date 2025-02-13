export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum AgeRange {
  TEEN = 'TEEN',
  ADULT = 'ADULT',
  SENIOR = 'SENIOR',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface Profile {
  firstName: string;
  lastName: string;
  nickname: string;
  bio: string;
  ageRange: AgeRange;
  gender: Gender;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  profile: Profile;
}
