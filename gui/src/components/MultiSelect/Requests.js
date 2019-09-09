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
  var query = {
    sort: [
      { field: api == "organization" ? "is_admin" : "is_manager", dir: "desc" }
    ],
    skip: 0,
    take: 1000
  };
  let response = await helper.request(
    "v1",
    "/" +
      api +
      "/" +
      selectedEntity +
      "/users?filter=[" +
      JSON.stringify(query) +
      "]",
    {},
    "get"
  );
  return response;
}
