const { checkSchema } = require('express-validator');
const { asyncHandler } = require('../../handlers/error');
const RepairServices = require('../../db/models/RepairServices');
const { SERVICE } = require('../../config');
const { extractRequiredFields } = require('../../handlers');

const repairServicesPayload = isOptional => ({
  phoneType: {
    trim: true,
    notEmpty: true,
    optional: Boolean(isOptional),
    errorMessage: (value, { req }) => req.t('INVALID_MSG', { field: 'phoneType' }),
  },
  serviceType: {
    trim: true,
    notEmpty: true,
    optional: Boolean(isOptional),
    errorMessage: (value, { req }) => req.t('INVALID_MSG', { field: 'serviceType' }),
  },
  serviceCost: {
    trim: true,
    isNumeric: true,
    optional: Boolean(isOptional),
    errorMessage: (value, { req }) => req.t('SHOULD_BE_NUMERIC', { field: 'serviceCost' }),
  },
  serviceCurrency: {
    trim: true,
    isString: true,
    optional: Boolean(isOptional),
    errorMessage: (value, { req }) => req.t('INVALID_VALUE', { value }),
  },
  warantiDuration: {
    trim: true,
    optional: Boolean(isOptional),
    errorMessage: (value, { req }) => req.t('INVALID_VALUE', { value }),
  },
  serviceStatus: {
    trim: true,
    notEmpty: true,
    optional: Boolean(isOptional),
    isIn: {
      options: [SERVICE.type],
      errorMessage: (value, { req }) => req.t('SHOULD_BE_IN_LIST', {
        field: 'serviceStatus',
        list: SERVICE.type.join(', '),
      }),
    },
  },
});

const createRepairServicesPayload = repairServicesPayload(false);
const createRepairServicesValidationSchema = checkSchema(createRepairServicesPayload);

const createRepairServices = asyncHandler(async (req, res) => {
  const repairServicesPayload = extractRequiredFields(Object.keys(createRepairServicesPayload), req.body);
  const newRepairServices = new RepairServices(repairServicesPayload);
  await newRepairServices.save();
  res.status(201).json(newRepairServices);
});

module.exports = { createRepairServices, createRepairServicesValidationSchema, repairServicesPayload };
