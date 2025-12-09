import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsMetadata(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    if (!validationOptions?.message) {
      validationOptions = {
        ...validationOptions,
        message: `${propertyName} must be an object with string keys (alphanumeric and underscores only) and string values (max length 255 characters)`,
      };
    }

    registerDecorator({
      name: 'IsMetadata',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'object' || value === null) return false;

          return Object.entries(value as Record<string, unknown>).every(
            ([key, value]) => {
              return (
                typeof key === 'string' &&
                /^[a-zA-Z0-9_]+$/.test(key) &&
                typeof value === 'string' &&
                value.length < 256
              );
            },
          );
        },
      },
    });
  };
}
