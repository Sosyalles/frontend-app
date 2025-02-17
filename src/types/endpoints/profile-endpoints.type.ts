// Profile Endpoint Types
import { UpdateUserDTO, UserResponseDTO, PaginatedUsersResponse } from '../dtos/user.dto';
import { UpdateUserDetailDTO, UserDetailResponseDTO } from '../dtos/profile.dto';
import { 
  ApiResponseUserDTO, 
  ApiResponseUserDetailDTO, 
  ApiResponseProfilePhotos 
} from '../responses/api-responses.dto';

export type ProfileGetEndpoint = {
  response: ApiResponseUserDTO;
};

export type ProfileUpdateEndpoint = {
  requestBody: UpdateUserDTO;
  response: ApiResponseUserDTO;
};

export type ProfileDetailsGetEndpoint = {
  response: ApiResponseUserDetailDTO;
};

export type ProfileDetailsUpdateEndpoint = {
  requestBody: UpdateUserDetailDTO;
  response: ApiResponseUserDetailDTO;
};

export type ProfilePhotosUploadEndpoint = {
  requestBody: FormData;
  response: ApiResponseProfilePhotos;
};

export type UsersListEndpoint = {
  queryParams: {
    page?: number;
    limit?: number;
    search?: string;
  };
  response: {
    status: string;
    message: string;
    data: PaginatedUsersResponse;
  };
}; 