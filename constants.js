export const patronIdentifierTypes = [
    { key: 'barcode', label: 'Barcode' },
    { key: 'externalSystemId', label: 'External System ID' },
    { key: 'id', label: 'FOLIO Record Number' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
];

export const samlBindingTypes = [
    { key: 'POST', label: 'POST binding' },
    { key: 'REDIRECT', label: 'Redirect binding' },
];

export const samlConfigurationKeys = [
    { key: 'idp.url', placeholder: 'IdP URL' },
    { key: 'saml.binding', placeholder: 'SAML binding' },
    { key: 'saml.attribute', placeholder: 'SAML attribute' },
    { key: 'user.propery', placeholder: 'User property' },
];


export const samlDefaultConfigurationValues = {
  'idp.url': '',
  'saml.binding': 'POST',
  'saml.attribute': 'UserID',
  'user.propery': 'username',
};

export default '';
