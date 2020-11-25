export function scrollDashboardToTop(){
    document.getElementById("page-content").scrollTo(0,0)
}

export function preparefilter(filter1, filter2) {
    var filter = []
    filter.push(filter1)
    filter.push("AND")
    filter.push(filter2)
    return filter
  }