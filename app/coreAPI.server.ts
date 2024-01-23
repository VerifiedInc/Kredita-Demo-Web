import { config } from '~/config';
import { logger } from './logger.server';

/**
 * Represents a credential request
 */
export interface CredentialRequest {
  type: string; // type of credential data being requested
  issuers?: string[]; // list of acceptable brandIds; if empty all issuer brands are valid
  required?: boolean; // if a credential is required (default is true)
  mandatory?: string; // if a credential is mandatory (default is yes)
  description?: string; // description of the credential request
  allowUserInput?: boolean; // if the user can input the credential data (default is false)
  children?: CredentialRequest[]; // if the credential is a composite credential, the children credential requests
}

/**
 * Interface to encapsulate the options for the /hasMatchCredentials API call
 */
export interface HasMatchingCredentialsOptions {
  email?: string; // user's email address
  phone?: string; // user's phone number
  credentialRequests: CredentialRequest[]; // Encodes which credentials are being asked for
}

export interface OneClickOptions {
  phone: string;
  content?: {
    title?: string;
    description?: string;
  };
  credentialRequests?: CredentialRequest[]; // Encodes which credentials are being asked for 1-click
  verificationOptions?: 'only_link' | 'only_code' | 'both_link_and_code';
}

/**
 * Represents a credential object which contains plaintext user data.
 */
interface Credential {
  id: string; // credential id
  type: string; // credential type
  issuer: string; // credential issuer brandId
  issuanceDate: number; // when credential was created as a milliseconds since epoch unix timestamp
  expirationDate?: number; // when credentials expires as a milliseconds since epoch unix timestamp
  data: Map<string, any>; // credential data map that matches the credential type's JSON Schema definition
}

/**
 * Interface to encapsulate the response body for the /sharedCredentials API call
 */
interface SharedCredentials {
  uuid: string; // the uuid from the query parameter of the redirect back to your client; identifies the collection of credentials shared by the user
  credentials: Credential[]; // a list of one or more Credential objects
  email?: string; // the user's email from the input to /hasMatchingCredentials; only present if email was provided
  phone?: string; // the user's phone from the input to /hasMatchingCredentials; only present if phone was provided
}

/**
 * Function to make POST request to Verified Inc.'s Core Service API /hasMatchingCredentials endpoint. The intent is to check if
 * a user already has the necessary email and phone credential to enable 1-click sign up.
 * Please note: This functionality is NOT and should NOT be called in the browser due to the sensitive nature
 * of the API key (unumAPIKey).
 *
 * Documentation: https://docs.unumid.co/api-overview#check-user-credentials
 * @param email
 * @param phone
 * @returns {Promise<string | null>} if a match for the request is found, returns the Verified Inc. Web Wallet url for redirect, if no match is found returns null
 */
export const hasMatchingCredentials = async (
  email?: string,
  phone?: string
): Promise<string | null> => {
  if (!email && !phone) return null; // short circuit if neither email nor phone are provided

  const headers = {
    Authorization: 'Bearer ' + config.unumAPIKey,
    'Content-Type': 'application/json',
  };

  const credentialRequests: CredentialRequest[] = [
    {
      type: 'FullNameCredential',
      issuers: [], // any issuer accepted
      required: false,
    },
    {
      type: 'EmailCredential',
      issuers: [], // any issuer accepted
      required: true,
    },
    {
      type: 'PhoneCredential',
      issuers: [], // any issuer accepted
      required: false,
    },
    {
      type: 'SexCredential',
      issuers: [], // any issuer accepted
      required: false,
    },
    {
      type: 'DobCredential',
      issuers: [], // any issuer accepted
      required: false,
    },
    {
      type: 'SsnCredential',
      issuers: [], // any issuer accepted
      required: false,
    },
    {
      type: 'NationalityCredential',
      issuers: [], // any issuer accepted
      required: false,
    },
    {
      type: 'GovernmentIdTypeCredential',
      issuers: [], // any issuer accepted
      required: false,
    },
    {
      type: 'GovernmentIdStateCredential',
      issuers: [], // any issuer accepted
      required: false,
    },
    {
      type: 'GovernmentIdNumberCredential',
      issuers: [], // any issuer accepted
      required: false,
    },
    {
      type: 'GovernmentIdIssuanceDateCredential',
      issuers: [], // any issuer accepted
      required: false,
    },
    {
      type: 'GovernmentIdExpirationDateCredential',
      issuers: [], // any issuer accepted
      required: false,
    },
  ];

  const options: HasMatchingCredentialsOptions = {
    credentialRequests,
  };

  if (email) options.email = email;
  if (phone) options.phone = phone?.startsWith('+1') ? phone : '+1' + phone;

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
        `No credentials matched for ${email}. Error: ${result.message}`
      );
      return null;
    }

    logger.info(
      `Has matching credentials? ${result.match}. ${
        result.match
          ? `Response wallet URL with for redirect: ${result.url}`
          : ``
      }`
    );

    // if there is a match then a url with the matching email and/or phone and a requestId query parameters will be returned
    return result.match ? result.url : null;
  } catch (e) {
    logger.error(`hasMatchingCredentials for ${email} failed. Error: ${e}`);
    throw e;
  }
};

/**
 * Function to make GET request to Verified Inc.'s Core Service API /sharedCredentials/{uuid} endpoint. The intent is to retrieve
 * the credentials shared by the user after they've completed a credentials request.
 * Please note: This functionality is NOT and should NOT be called in the browser due to the sensitive nature
 * of the API key (unumAPIKey).
 *
 * Documentation: https://docs.unumid.co/api-overview#get-shared-credentials
 * @param uuid
 * @returns {Promise<SharedCredentials | null>} if a match for the request is found, returns the shared credentials, if no match is found returns null
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
    return result as SharedCredentials;
  } catch (e) {
    logger.error(`GET sharedCredentials for uuid: ${uuid} failed. Error: ${e}`);
    throw e;
  }
};

/**
 * Function to make POST request to Verified Inc.'s Core Service API /1-click endpoint. The call
 * sends an SMS containing a link to allow user to do 1-click sign up.
 * Please note: This functionality is NOT and should NOT be called in the browser due to the sensitive nature
 * of the API key (unumAPIKey).
 * 
 * Documentation: https://docs.unumid.co/api-overview#one-click

 * @param phone
 * @returns {Promise<{ url: string; phone: string }>} Returns an url that leads to 1-click signup request page
 */
export const oneClick = async (
  phone?: string,
  oneClickOptions?: Partial<OneClickOptions>
): Promise<{ url: string; phone: string }> => {
  // short circuit if phone are not provided
  if (!phone) {
    throw new Error('Phone was not provided');
  }

  const headers = {
    Authorization: 'Bearer ' + config.unumAPIKey,
    'Content-Type': 'application/json',
  };

  const options: OneClickOptions = {
    phone,
    content: {
      title: 'Signup',
      description: 'Make sure everything is correct: ',
    },
    ...oneClickOptions,
  };

  if (phone) options.phone = phone?.startsWith('+1') ? phone : '+1' + phone;

  const body = JSON.stringify(options);

  try {
    const response = await fetch(config.coreServiceUrl + '/1-click', {
      method: 'POST',
      headers,
      body,
    });
    const result = await response.json();

    if (!result?.url?.length) {
      logger.debug(
        `Phone invalid or unsupported ${phone}. Error: ${result.message}`
      );

      throw new Error('Phone invalid or unsupported. Please try again');
    }

    logger.info(
      `1-click. ${
        result.url ? `Response wallet URL with for redirect: ${result.url}` : ``
      }`
    );

    // the url will contain link or not based on credential request configuration
    return { url: result.url, phone };
  } catch (e) {
    logger.error(`oneClick for ${phone} failed. Error: ${e}`);
    throw e;
  }
};

export type BrandDto = {
  uuid: string;
  receiverName: string;
  logoImageUrl: string;
  homepageUrl: string;
  primaryColor: string;
};

/**
 * Get a brand DTO by uuid.
 * @param brandUuid Brand uuid.
 * @param accessToken Access token to access core service API.
 * @returns
 */
const mapBrandDto = (brandDto: any): BrandDto => ({
  uuid: brandDto.uuid,
  receiverName: brandDto.receiverName,
  logoImageUrl: brandDto.logoImageUrl,
  homepageUrl: brandDto.homepageUrl,
  primaryColor: brandDto.primaryColor,
});
export const getBrandDto = async (
  brandUuid: string,
  accessToken: string
): Promise<BrandDto | null> => {
  try {
    const headers = {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    };

    const response = await fetch(
      config.coreServiceUrl + `/brands/${brandUuid}`,
      {
        method: 'GET',
        headers,
      }
    );

    if (!response.ok) return null;

    const result = await response.json();

    return mapBrandDto(result);
  } catch (e) {
    logger.error(`getBrand failed. Error: ${e}`);
    return null;
  }
};
