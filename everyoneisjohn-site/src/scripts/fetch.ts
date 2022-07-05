import customFetch from "./customFetch";

function doFetch(url: string, _method: string, success: (d: any) => void, fail: (d: any) => void, _headers: any = {}, _data: object = {default: true}) {
    let optn = {
        method: _method,
        headers: (!_data.hasOwnProperty("default") && _method != "GET") ? {
            ..._headers,
            "Content-Type": "application/json"
        } : _headers,
        body: (!_data.hasOwnProperty("default") && _method != "GET") ? JSON.stringify(_data) : null
    };

    customFetch(url, success, fail, optn);
}

export default doFetch;