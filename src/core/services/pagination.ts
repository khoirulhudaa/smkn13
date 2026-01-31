import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "@/core/configs/app";
import { getInitialOptions } from "@/core/utils/http";
import { StudentPaginationResponse } from "@/core/models/pagination";
import { withQuery } from "../utils/withQuery";
import { getToken } from "@/features/auth";

export interface GetPaginatedStudentParams {
  page: number;
  size: number;
  sekolahId?: number;
  idKelas?: number;
  keyword?: string;
}
export const studentService = {
  getPaginated: async (params: GetPaginatedStudentParams): Promise<StudentPaginationResponse> => {
    const query = {
      page: params.page,
      size: params.size,
      ...(params.sekolahId && { sekolahId: params.sekolahId }),
      ...(params.idKelas !== undefined && { idKelas: params.idKelas }),
      ...(params.keyword && { keyword: params.keyword }),
    };

    const url = withQuery(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.student.list}`,
      query
    );

    const options = getInitialOptions(); // ✅ Sudah include bearerToken

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${options.bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    return {
      students: json.data,
      pagination: json.pagination,
    };
  },
};
  
