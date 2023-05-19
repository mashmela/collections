type RequestResponseInterface<GenericDataType extends object> =
  | {
      success: true;
      data: GenericDataType;
    }
  | {
      success: false;
      message?: string;
    };

export async function sendRequest<GenericDataType extends object>(
  path: string,
  payload: object = {},
): Promise<RequestResponseInterface<GenericDataType>> {
  const response = await fetch("http://localhost:3000/api" + path, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
  if (!response || response?.error) return { success: false, message: response?.message };
  return { success: true, data: response as GenericDataType };
}
