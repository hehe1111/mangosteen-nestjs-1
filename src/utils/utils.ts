export const generateRedisKeyForCode = (email: string) =>
  `validation_codes_sign_in_${email}`
