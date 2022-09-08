import axios from "axios";
import config from '../../config.json' assert { type: 'json'};

const helper = {
  API: (END_POINT = 'api') =>
    axios.create({
      baseURL: `${config.api.host}/${END_POINT}`,
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: status => (status >= 200 && status < 404) || status === 500
    }),
  CONTRACT_API: (END_POINT = 'api') =>
    axios.create({
      baseURL: `${config.api.host}:${config.api.contractPort}/${END_POINT}`,
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: status => (status >= 200 && status < 404) || status === 500
    })
};

export default helper;