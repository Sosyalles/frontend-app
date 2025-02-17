// Internal Service Endpoint Types
import { ApiResponseUserDTO } from '../responses/api-responses.dto';

export type InternalUserByIdEndpoint = {
  pathParams: {
    id: number;
  };
  response: ApiResponseUserDTO;
};

export type InternalUserByUsernameEndpoint = {
  pathParams: {
    username: string;
  };
  response: ApiResponseUserDTO;
}; 