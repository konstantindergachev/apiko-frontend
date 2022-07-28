export interface IErrorResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  request?: any;
}

export interface IError {
  code?: string;
  request?: any;
  response?: IErrorResponse;
  isError: boolean;
  toJSON: () => object;
}

async function http<T>(path: string, config: RequestInit): Promise<T> {
  const request = new Request(path, config);
  const response = await fetch(request);

  try {
    if (response.status === 401) {
      throw new Error(response.statusText);
    }
    return response.json();
  } catch (error) {
    const isError = (something: any): something is IError => {
      return something.isError === true;
    };
    if (isError(error)) {
      const message = { message: error.response?.statusText };
      return response.json().catch(() => message);
    }
  }

  return response.json().catch(() => ({}));
}

export async function get<T>(path: string, config?: RequestInit): Promise<T> {
  const init = { method: 'get', ...config };
  return await http<T>(path, init);
}

export async function post<T, U>(path: string, body: T, config?: RequestInit): Promise<U> {
  const init = { method: 'post', body: JSON.stringify(body), ...config };
  return await http<U>(path, init);
}

export async function put<T, U>(path: string, body: T, config?: RequestInit): Promise<U> {
  const init = { method: 'put', body: JSON.stringify(body), ...config };
  return await http<U>(path, init);
}

export async function remove<T>(path: string, config?: RequestInit): Promise<T> {
  const init = { method: 'delete', ...config };
  return await http<T>(path, init);
}
