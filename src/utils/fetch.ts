const server_url = import.meta.env.VITE_SERVER_URL;

type Headers = {
  [key: string]: string;
};

export class Fetch {
  url: string;
  headers: Headers;
  body: any;
  serverUrl: string;
  authId: string;

  constructor(url: string, authId: string, body?: any, ) {
    this.url = url;
    this.authId = authId;
    this.headers = { 
      "Content-Type": "application/json",
      'authid': this.authId
    };
    this.body = body;
    this.serverUrl = server_url;
  }

  async get() {
    const res = fetch(this.serverUrl + this.url, {
      headers: this.headers,
      credentials: "include",
    });

    const data = await (await res).json();
    return data;
  }

  async post() {
    const res = fetch(this.serverUrl + this.url, {
      method: "POST",
      credentials: "include",
      headers: this.headers,
      body: JSON.stringify(this.body),
    });
    const data = await (await res).json();
    return data;
  }

  async put() {
    const res = fetch(this.serverUrl + this.url, {
      method: "PUT",
      credentials: "include",
      headers: this.headers,
      body: JSON.stringify(this.body),
    });
    const data = await (await res).json();
    return data;
  }

  async delete() {
    const res = fetch(this.serverUrl + this.url, {
      method: "DELETE",
      credentials: "include",
      headers: this.headers,
      body: JSON.stringify(this.body),
    });
    const data = await (await res).json();
    return data;
  }
}
