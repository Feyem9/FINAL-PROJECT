import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExternalResourcesService {
  async fetchFromIMSLP(query: string) {
    // Note: IMSLP does not officially support a public API, so this is a hypothetical example.
    // You would need to check their terms of service and possibly use a web scraping library that respects their robots.txt.
    const response = await axios.get(`https://imslp.org/api/query?query=${query}`);
    return response.data;
  }

  async fetchFromMuseScore(query: string) {
    // MuseScore has an API, but you need to register and get an API key.
    const API_KEY = 'your_musescore_api_key';
    const response = await axios.get(`https://musescore.com/api/scores?api_key=${API_KEY}&query=${query}`);
    return response.data;
  }
}
