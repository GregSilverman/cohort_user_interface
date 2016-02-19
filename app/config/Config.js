Ext.define("cardioCatalogQT.config.Config", {
    alternateClassName: [
        'cardioCatalogQT.config'
    ],
    singleton: true,

    constant: {

        // ... whatever constant you need to put here
        protocol: 'http://',
        host: '127.0.0.1:5000',
        apiMenu: '/menu/',
        apiResultsGet: '/remote_results_get',
        apiQueryGet: '/remote_query_get'

    },

    constructor: function() {
        var constant = this.constant;

        //
        // here, if you need to process some stuff
        // for example calculate some constant
        // which depend of other constant
        //


        return constant;
    }
});