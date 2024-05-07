import { Metadata } from '@tunnelhub/sdk';

/**
 * Return all columns that will be visible on the monitoring screen.
 * The components order is the display order in the monitoring table.
 *
 * The implementation of this method is mandatory
 */
export default [
  {
    fieldName: 'key_field',
    fieldLabel: 'Key field',
    fieldType: 'TEXT',
  },
  {
    fieldName: 'regular_field',
    fieldLabel: 'Regular field',
    fieldType: 'TEXT',
  },
] as Metadata[];