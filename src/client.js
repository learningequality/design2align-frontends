import axios from "axios";
import session from "./session";

export const baseUrl = "https://alignmentapp.learningequality.org";

export function login(username, password) {
  return axios
    .post(`${baseUrl}/api-token-auth/`, { username, password })
    .then(response => {
      session.username = username;
      session.token = response.data.token;
    });
}

class Resource {
  constructor(resourceName) {
    this.resourceName = resourceName;
  }

  get baseUrl() {
    return `${baseUrl}/api/${this.resourceName}/`;
  }

  get config() {
    return {
      headers: {
        Authorization: `Token ${session.token}`
      }
    };
  }

  modelUrl(id) {
    return `${this.baseUrl}${id}`;
  }

  getModel(id) {
    return axios.get(this.modelUrl(id), this.config).then(response => {
      return response.data;
    });
  }
}

class DocumentResource extends Resource {
  getDocuments() {
    return axios.get(`${this.baseUrl}`, this.config).then(response => {
      return response.data.results;
    });
  }
}
export const documentResource = new DocumentResource("document");

class NodeResource extends Resource {
  getComparisonNodes(scheduler = "random") {
    return axios
      .get(`${this.baseUrl}?scheduler=${scheduler}`, this.config)
      .then(response => {
        return response.data.results;
      });
  }
  getDocumentNode(documentID) {
    return axios
      .get(`${this.baseUrl}?document=${documentID}&depth=1`, this.config)
      .then(response => {
        return response.data.results[0];
      });
  }
  getChildren(nodeID) {
    return axios.get(`${this.baseUrl}${nodeID}`, this.config).then(response => {
      return response.data.children;
    });
  }
}

export const nodeResource = new NodeResource("node");

class JudgmentResource extends Resource {
  submitJudgment(node1, node2, rating, confidence, uiName, extraFields) {
    return axios.post(
      this.baseUrl,
      {
        node1,
        node2,
        rating,
        confidence,
        ui_name: uiName,
        ui_version_hash: __webpack_hash__,
        mode: "rapid_feedback",
        extra_fields: {
          ...extraFields,
          is_dev_build: process.env.NODE_ENV !== "production"
        }
      },
      this.config
    );
  }
}

export const judgmentResource = new JudgmentResource("judgment");
