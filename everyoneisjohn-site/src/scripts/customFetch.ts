export let isLocalhost = document.location.href.includes("localhost");

export let preUrl = isLocalhost ? "https://localhost:7257/api/" : "https://portalapi.etherlive.com/api/";

function customFetch(url: string, success: (d: any) => void, fail: (d: any) => void, _options: any = {}) {
    let optn = {..._options, credentials: "include"};

    if (isLocalhost) {
        optn.headers = {
            ...optn.headers,
            id: localStorage.getItem('id'),
            key: localStorage.getItem('key'),
            johnId: localStorage.getItem('johnId'),
            'Sec-Fetch-Mode': 'no-cors'
        }
    }

    fetch(preUrl + url, optn)
        .then(
            response => {
                if (response.status == 200) {
                    return response.json()
                        .catch(() => {
                            return {good: true};
                        })
                } else if (response.status == 401) {
                    if (!url.includes("check")) {

                        //No Login

                    }
                    return {good: false, data: null};
                } else {
                    return response.json()
                        .then((value => {
                            return {data: value, good: false};
                        }))
                        .catch(() => {
                            return {good: false};
                        })
                }
            })
        .then(data => {
            if ((data.hasOwnProperty("good") && !data["good"]) || (data.hasOwnProperty("status") && data.hasOwnProperty("detail"))) {
                fail(data["data"]);
            } else {
                success(data);
            }
        })
}

export default customFetch;