import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class HttpAdapterService {
  public async get(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
}
