import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class HttpAdapterService {
  private axiosInstance = axios.create();

  async get(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await this.axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }

  setBaseURL(baseURL: string) {
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  setTimeout(timeout: number) {
    this.axiosInstance.defaults.timeout = timeout;
  }

  setHeaders(headers: any) {
    this.axiosInstance.defaults.headers = headers;
  }
}
