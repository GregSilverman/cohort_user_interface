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
        apiLabs: '/labs/',
        apiBasicVitals: '/basic_vitals/',
        apiResultsGet: '/remote_results_get',
        apiQueryGet: '/remote_query_get',
        apiAttributeGet: '/attribute'

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