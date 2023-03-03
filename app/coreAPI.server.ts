import { config } from '~/config';
import { logger } from './logger.server';

/**
 * Represents a credential request
 */
export interface CredentialRequest {
  type: string; // type of credential data being requested
  issuers: string[]; // list of acceptable brandIds; if empty all issuer brands are valid
  required?: boolean; // if a credential is required (default is true)
}

/**
 * Interface to encapsulate the options for the /hasMatchCredentials API call
 */
export interface HasMatchingCredentialsOptions {
  email?: string; // user's email address
  phone?: string; // user's phone number
  credentialRequests: CredentialRequest[]; // Encodes which credentials are being asked for
}

/**
 * Function to make POST request to Unum ID's Core Service API /hasMatchingCredentials endpoint. The intent is to check if
 * a user already has the necessary email and phone credential to enable 1-click sign up.
 * Please note: This functionality is NOT and should NOT be called in the browser due to the sensitive nature
 * of the API key (unumAPIKey).
 *
 * Documentation: https://docs.unumid.co/api-overview#check-user-credentials
 * @param email
 * @param phone
 * @returns {Promise<string | null>} if a match for the request is found, returns the Unum ID Web Wallet url for redirect, if no match is found returns null
 */
export const hasMatchingCredentials = async (
  email: string | undefined,
  phone: string | undefined
): Promise<string | null> => {
  if (!email && !phone) return null; // short circuit if neither email nor phone are provided

  const headers = {
    Authorization: 'Bearer ' + config.unumAPIKey,
    'Content-Type': 'application/json',
  };

  const credentialRequests: CredentialRequest[] = [
    {
      type: 'EmailCredential',
      issuers: [], // any issuer accepted
      required: true,
    },
    {
      type: 'PhoneCredential',
      issuers: [], // any issuer accepted
      required: true,
    },
  ];

  const options: HasMatchingCredentialsOptions = {
    email,
    phone,
    credentialRequests,
  };

  const body = JSON.stringify(options);

  try {
    const response = await fetch(
      config.coreServiceUrl + '/hasMatchingCredentials',
      {
        method: 'POST',
        headers,
        body,
      }
    );
    const result = await response.json();

    if (result?.code) {
      logger.debug(
        `No credentials issued for ${email}. Error: ${result.message}`
      );
      return null;
    }

    logger.info(`Has matching credentials? ${result.match}.`);

    return result.url;
  } catch (e) {
    logger.error(`issueCredentials for ${email} failed. Error: ${e}`);
    throw e;
  }
};

/**
 * Function to make GET request to Unum ID's Core Service API /sharedCredentials/{uuid} endpoint. The intent is to retrieve
 * the credentials shared by the user after they've completed a credentials request.
 * Please note: This functionality is NOT and should NOT be called in the browser due to the sensitive nature
 * of the API key (unumAPIKey).
 *
 * Documentation: https://docs.unumid.co/api-overview#get-shared-credentials
 * @param uuid
 * @returns {Promise<string | null>} if a match for the request is found, returns the Unum ID Web Wallet url for redirect, if no match is found returns null
 */
export const sharedCredentials = async (uuid: string) => {
  const headers = {
    Authorization: 'Bearer ' + config.unumAPIKey,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(
      config.coreServiceUrl + '/sharedCredentials/' + uuid,
      {
        method: 'GET',
        headers,
      }
    );

    const result = await response.json();

    if (result?.code) {
      logger.debug(
        `No shared credentials found for uuid: ${uuid}. Error: ${result.message}`
      );
      return null;
    }

    logger.info(
      `Successfully retrieved shared credentials for uuid: ${result.uuid}.`
    );

    // In a production environment the shared credentials should be appropriately stored in
    // a manner that can be accessed as needed. A brand's access to shared credentials via
    // this endpoint is deleted after 5 minutes of the initial data retrieval.
    return result;
  } catch (e) {
    logger.error(`GET sharedCredentials for uuid: ${uuid} failed. Error: ${e}`);
    throw e;
  }
};
