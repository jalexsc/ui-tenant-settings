const composeValidators = (...validators) => values => {
  return validators.reduce((errors, validator) => Object.assign(errors, validator(values)), {});
};

export default composeValidators;
