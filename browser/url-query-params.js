var urlQueryParams = require('../lib/query-string');
var applyUrl = require('../lib/apply-url');
window.urlQueryParams = {
    queryString: urlQueryParams.queryString,
    processUrl: applyUrl.processUrl
};
