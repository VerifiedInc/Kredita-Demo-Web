export type PersonalInformationLoader = {
  email?: string;
  fullName?:
    | {
        firstName?: string;
        middleName?: string;
        lastName?: string;
      }
    | string;
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  birthDate?: string;
  ssn?: string;
};
