import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import { BiodataSiswa } from "../models/biodata";
import { BiodataGuru } from "../models/biodata-guru";

export const biodataService = {
  siswa: http.get<BaseResponse<BiodataSiswa[]>>(
    API_CONFIG.baseUrlOld + SERVICE_ENDPOINTS.biodata.siswa,
    getInitialOptions,
  ),
  checkAllAttendances: http.get<BaseResponse<BiodataSiswa[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.biodata.allAttedance,
    getInitialOptions,
  ),
  siswaById: (id: number) =>
    http.get<BaseResponse<BiodataSiswa>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.biodata.siswa,
      getInitialOptions,
    )({ path: String(id) }),
  guru: http.get<BaseResponse<BiodataGuru[]>>(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.biodata.guru}`,
    getInitialOptions,
  ),
  checkAttendance: (id: number | string) =>
    http.get<BaseResponse<BiodataSiswa>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.biodata.attedance}`,
      getInitialOptions,
    )({ path: String(id) }),
  guruById: (id: number) =>
    http.get<BaseResponse<BiodataGuru>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.teacher.detail}`,
      getInitialOptions,
    )({ path: String(id) }),
};
