// Authentication Endpoint Types
import { CreateUserDTO, LoginRequestDTO, ChangePasswordDTO } from '../dtos/auth.dto';
import { ApiResponseUserDTO, LoginResponseDTO, ApiResponse } from '../responses/api-responses.dto';

export type AuthRegisterEndpoint = {
  requestBody: CreateUserDTO;
  response: ApiResponseUserDTO;
};

export type AuthLoginEndpoint = {
  requestBody: LoginRequestDTO;
  response: LoginResponseDTO;
};

export type AuthChangePasswordEndpoint = {
  requestBody: ChangePasswordDTO;
  response: ApiResponse;
}; 