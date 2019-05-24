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
  let response = await helper.request("v1", "/" + api + "?psz=1000", {}, "get");
  return response.data;
}

export async function GetDataSearch(api, term) {
  let response = await helper.request(
    "v1",
    "/" + api + "?q=" + term + "&psz=10",
    {},
    "get"
  );
  return response.data;
}

export async function ExistingUsers(api, selectedEntity) {
  let response = await helper.request(
    "v1",
    "/" + api + "/" + selectedEntity + "/users",
    {},
    "get"
  );
  return response.data;
}
