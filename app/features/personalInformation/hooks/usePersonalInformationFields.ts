import { useLoaderData } from '@remix-run/react';
import { useMemo } from 'react';

import { fieldSchema } from '~/validations/field.schema';
import { emailSchema } from '~/validations/email.schema';
import { stateSchema } from '~/validations/state.schema';
import { countrySchema } from '~/validations/country.schema';
import { SSNSchema } from '~/validations/ssn.schema';
import { birthDateSchema } from '~/validations/birthDate.schema';

import { PersonalInformationLoader } from '~/features/personalInformation/types';

import { useField } from '~/hooks/useField';

export function usePersonalInformationFields() {
  const {
    oneClick: { credentials: data },
  } = useLoaderData<PersonalInformationLoader>();

  const firstName = useField({
    name: 'firstName',
    label: 'First Name',
    schema: fieldSchema,
    initialValue:
      typeof data.fullName === 'string'
        ? data.fullName
        : data.fullName?.firstName,
  });

  const middleName = useField({
    name: 'middleName',
    label: 'Middle Name',
    schema: fieldSchema,
    initialValue:
      typeof data.fullName === 'string' ? '' : data.fullName?.middleName,
  });

  const lastName = useField({
    name: 'lastName',
    label: 'Last Name',
    schema: fieldSchema,
    initialValue:
      typeof data.fullName === 'string' ? '' : data.fullName?.lastName,
  });

  const email = useField({
    name: 'email',
    label: 'Email',
    schema: emailSchema,
    initialValue: data.email,
  });

  const line1 = useField({
    name: 'line1',
    label: 'Address Line 1',
    schema: fieldSchema,
    initialValue: data.address?.line1,
  });

  const line2 = useField({
    name: 'line2',
    label: 'Address Line 2',
    schema: fieldSchema,
    initialValue: data.address?.line2,
  });

  const city = useField({
    name: 'city',
    label: 'City',
    schema: fieldSchema,
    initialValue: data.address?.city,
  });

  const state = useField({
    name: 'state',
    label: 'State',
    schema: stateSchema,
    initialValue: data.address?.state,
  });

  const country = useField({
    name: 'country',
    label: 'Country',
    schema: countrySchema,
    initialValue: data.address?.country,
  });

  const zipCode = useField({
    name: 'zipCode',
    label: 'Zip Code',
    schema: fieldSchema,
    initialValue: data.address?.zipCode,
  });

  const birthDate = useField({
    name: 'birthDate',
    label: 'Birth Date',
    schema: birthDateSchema,
    initialValue: (() => {
      if (!data.birthDate) return '';
      const date = new Date(Number(data.birthDate));
      return date.toISOString().split('T')[0];
    })(),
  });

  const ssn = useField({
    name: 'ssn',
    label: 'SSN',
    schema: SSNSchema,
    initialValue: data?.ssn,
  });

  const fields = useMemo(
    () => ({
      firstName,
      middleName,
      lastName,
      email,
      line1,
      line2,
      city,
      state,
      country,
      zipCode,
      birthDate,
      ssn,
    }),
    [
      firstName,
      middleName,
      lastName,
      email,
      line1,
      line2,
      city,
      state,
      country,
      zipCode,
      birthDate,
      ssn,
    ]
  );

  // Specified the required fields
  const requiredFields = useMemo(
    () => [
      'firstName',
      'lastName',
      'email',
      'line1',
      'city',
      'state',
      'country',
      'zipCode',
      'birthDate',
      'ssn',
    ],
    []
  );

  // Check if all fields are valid (if they are required)
  const isValid = useMemo(
    () =>
      Object.entries(fields).every(([, field]) =>
        requiredFields.includes(field.name) ? field.isValid(field.value) : true
      ),
    [fields, requiredFields]
  );

  return { fields, isValid, requiredFields };
}
