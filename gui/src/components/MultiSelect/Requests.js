import osjs from "osjs";
let helper = osjs.make("oxzion/restClient");

export async function ExcludeUsers(api, excludeList, term, size) {
  if (term) {
    var query = {
      filter: {
        logic: "and",
        filters: [{ field: "name", operator: "contains", value: term }]
      },
      skip: 0,
      take: size
    };
  } else {
    var query = {
      skip: 0,
      take: size
    };
  }

  let response = await helper.request(
    "v1",
    "/" + api,
    { exclude: excludeList, filter: "[" + JSON.stringify(query) + "]" },
    "post"
  );
  return response;
}

export async function ExistingUsers(api, selectedEntity) {
  let response = await helper.request(
    "v1",
    "/" + api + "/" + selectedEntity + "/users",
    {},
    "get"
  );
  return response;
}
