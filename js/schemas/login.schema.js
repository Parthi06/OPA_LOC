import * as schemaTypes from './schemaTypes';

export const LoginSchema = {

  name: schemaTypes.LOGIN_SCHEMA,
  properties: {
    password: { type: 'string?', default: "" },
    firstName: 'string',
    lastName: 'string',
    userType: 'int',
    errorMessage: 'string',
    userId: { type: 'int' },
    customerId: 'int?',
    customerDomain: 'string',
    authFlag: 'bool',
    isUserLicenseAgreed: { type: 'bool', default: false },
    logo: { type: 'string?'},
    token: 'string?',
    customerType: { type: 'string?', default: '' }
  }
};
