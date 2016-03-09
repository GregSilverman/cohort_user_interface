Ext.define("cardioCatalogQT.config.Config", {
    alternateClassName: [
        'cardioCatalogQT.config'
    ],
    singleton: true,

    constant: {

        // ... whatever constant you need to put here
        protocol: 'https://',
        //host: '127.0.0.1:5000',
        host: 'vein.ahc.umn.edu',
        apiMenu: '/api/menu/',
        apiLabs: '/api/labs/',
        apiBasicVitals: '/api/basic_vitals/',
        apiResultsGet: '/api/remote_results_get',
        apiQueryGet: '/api/remote_query_get',
        apiAttributeGet: '/api/attribute'

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