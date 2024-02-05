import { logger } from '~/logger.server';

export async function getFormDataOrEmpty(request: Request) {
  try {
    return await request.clone().formData();
  } catch (error) {
    logger.error('Error getting form data', error);
  }

  return new FormData();
}
