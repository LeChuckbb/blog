import { AnyObject, ObjectSchema, ObjectShape } from "yup";

export function validateRequest<T extends AnyObject>(
  data: unknown,
  schema: ObjectSchema<T>
) {
  const _data = schema.validateSync(data, {
    abortEarly: false,
    strict: true,
  });
  return _data;
}
