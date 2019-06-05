import osjs from "osjs";
let helper = osjs.make("oxzion/restClient");

export async function DeleteEntry(api, dataItem) {
  let response = await helper.request(
    "v1",
    "/" + api + "/" + dataItem,
    {},
    "delete"
  );
  return response;
}

export async function GetData(api) {
  let response = await helper.request("v1", "/" + api, {}, "get");
  return response;
}

export async function PushData(api, method, body) {
  let response = await helper.request(
    "v1",
    "/" + api,
    body,
    method
  );
  return response;
}
