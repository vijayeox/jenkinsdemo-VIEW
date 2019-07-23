import osjs from "osjs";
let helper = osjs.make("oxzion/restClient");

export async function GetContacts() {
  let response = await helper.request("v1", "/contact", {}, "get");
  return response;
}

export async function SaveContact(uuid, data) {
  if (Object.keys(data).length != 0) {
    for (var propName in data) {
      if (
        data[propName] == null ||
        data[propName] == "null" ||
        data[propName] == undefined
      ) {
        delete data[propName];
      }
    }
    if (uuid == "" || undefined || null) {
      let response = await helper.request("v1", "/contact", data, "filepost");
      return response;
    } else {
      let response = await helper.request(
        "v1",
        "/contact/" + uuid,
        data,
        "filepost"
      );
      return response;
    }
  }
}

export async function SearchContact(searchText) {
  let response = await helper.request(
    "v1",
    "/contact/search?column=-1&filter=" + searchText,
    {},
    "get"
  );
  return response;
}

export async function DeleteContact(uuid) {
  let response = await helper.request("v1", "/contact/" + uuid, {}, "delete");
  return response;
}

export async function ImportContacts(data) {
  let response = await helper.request("v1", "/contact/import", data, "filepost");
  return response;
}